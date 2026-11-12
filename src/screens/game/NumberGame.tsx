import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {AudioSource} from 'expo-audio';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import uuid from 'react-native-uuid';

import GameHeader from './GameHeader';
import Tile from './Tile';
import {AnimalImage} from './animal-picture';
import {ResultSheet} from './result-sheet';
import Confetti from '../../components/Confetti';
import Screen from '../../components/Screen';
import {SOUNDS_COUNT_QUESTION, useSoundStore} from '../../store/audio';
import {useGameScoreStore} from '../../store/game';
import {useSettingsStore} from '../../store/settings';
import {shuffle} from '../../utils/array';
import {gameConfig, shade} from '../../utils/color';
import {getRandomInt} from '../../utils/random';
import {useScale} from '../../utils/scale';
import {NavigationProp} from '../types';

type Props = {
  navigation: NavigationProp;
};

type AnimalSoundMap = {
  [animal: string]: {
    label: string;
    sound: AudioSource;
  };
};

const animalSoundMap: AnimalSoundMap = {
  duck: {label: 'de canards', sound: SOUNDS_COUNT_QUESTION.DUCK},
  rabbit: {label: 'de lapins', sound: SOUNDS_COUNT_QUESTION.RABBIT},
  dog: {label: 'de chiens', sound: SOUNDS_COUNT_QUESTION.DOG},
  pig: {label: 'de cochons', sound: SOUNDS_COUNT_QUESTION.PIG},
  cow: {label: 'de vaches', sound: SOUNDS_COUNT_QUESTION.COW},
  cat: {label: 'de chats', sound: SOUNDS_COUNT_QUESTION.CAT},
  bird: {label: "d'oiseaux", sound: SOUNDS_COUNT_QUESTION.BIRD},
  sheep: {label: 'de moutons', sound: SOUNDS_COUNT_QUESTION.SHEEP},
  owl: {label: 'de hiboux', sound: SOUNDS_COUNT_QUESTION.OWL},
  frog: {label: 'de grenouilles', sound: SOUNDS_COUNT_QUESTION.FROG},
  butterfly: {
    label: 'de papillons',
    sound: SOUNDS_COUNT_QUESTION.BUTTERFLY,
  },
  turtle: {label: 'de tortues', sound: SOUNDS_COUNT_QUESTION.TURTLE},
  ladybug: {label: 'de coccinelles', sound: SOUNDS_COUNT_QUESTION.LADYBUG},
  crab: {label: 'de crabes', sound: SOUNDS_COUNT_QUESTION.CRAB},
  whale: {label: 'de baleines', sound: SOUNDS_COUNT_QUESTION.WHALE},
};

const animalNames = Object.keys(animalSoundMap);

export interface SoundCountType {
  [key: string]: AudioSource;
}
const responseSoundMap: SoundCountType = {
  1: SOUNDS_COUNT_QUESTION.ONE,
  2: SOUNDS_COUNT_QUESTION.TWO,
  3: SOUNDS_COUNT_QUESTION.THREE,
  4: SOUNDS_COUNT_QUESTION.FOUR,
  5: SOUNDS_COUNT_QUESTION.FIVE,
  6: SOUNDS_COUNT_QUESTION.SIX,
  7: SOUNDS_COUNT_QUESTION.SEVEN,
  8: SOUNDS_COUNT_QUESTION.EIGHT,
  9: SOUNDS_COUNT_QUESTION.NINE,
};

const game = gameConfig('number');

// Carte blanche avec les animaux à compter, taille adaptée au nombre.
function CountField({count, animal}: {count: number; animal: string}) {
  const scale = useScale();
  const size =
    (count <= 3 ? 96 : count <= 4 ? 84 : count <= 6 ? 70 : 56) * scale;
  return (
    <View
      style={[
        styles.countField,
        {
          minHeight: 190 * scale,
          gap: 8 * scale,
          paddingVertical: 18 * scale,
          paddingHorizontal: 16 * scale,
        },
      ]}>
      <View
        style={[
          styles.countGlow,
          {
            backgroundColor: shade(game.color, 0.4),
            height: 100 * scale,
            bottom: -34 * scale,
          },
        ]}
      />
      {Array.from({length: count}).map((_, i) => (
        <AnimalImage key={i} type={animal} size={size} />
      ))}
    </View>
  );
}

export function NumberGame({navigation}: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [animals, setAnimals] = useState(['duck']);
  const store = useGameScoreStore();
  const playSound = useSoundStore((s) => s.play);
  const stopSound = useSoundStore((s) => s.stop);
  const audioLoading = useSoundStore((s) => s.audioLoading);
  const decor = useSettingsStore((s) => s.decor);
  const scale = useScale();
  const [picked, setPicked] = useState<number | null>(null);
  const [questionId, setQuestionId] = useState(uuid.v4());
  const [gameId] = useState(uuid.v4());

  const maxQuestion = 10;
  const maxAnswer = 9;

  function generateAnimals() {
    let animals = [...animalNames];
    while (animals.length < maxQuestion) {
      animals.push(animalNames[getRandomInt(animalNames.length) - 1]);
    }
    do {
      animals = shuffle(animals);
    } while (animals.some((v, i, a) => v === a[i + 1]));
    setAnimals(animals);
  }

  useEffect(() => {
    store.init(maxQuestion, maxAnswer, 1, true);
    generateAnimals();
    setIsLoaded(true);
    return () => {
      stopSound();
    };
  }, []);

  const question = store.questions[store.currentIndex];
  const answer = question?.answer;
  const animal = animals[store.currentIndex];
  const animalSound = animal ? animalSoundMap[animal] : undefined;

  useEffect(() => {
    if (!isLoaded || !question || !animalSound) return;
    const playAudio = async () => {
      await playSound(animalSound.sound);
    };
    void playAudio();
    void logEvent(getAnalytics(), 'question', {
      event_name: 'question',
      question_id: questionId,
      game_id: gameId,
      gameType: 'number',
      animal,
      answer: question.answer,
      possibility1: question?.possibilities[0].value,
      possibility2: question?.possibilities[1].value,
      possibility3: question?.possibilities[2].value,
      possibility4: question?.possibilities[3].value,
    });
  }, [isLoaded, store.currentIndex]);

  if (!isLoaded || !question || !animalSound) return <></>;

  const answered = picked !== null;
  const correct = answered && question.success;
  const results = store.questions.map((q, i) =>
    i < store.currentIndex || (i === store.currentIndex && answered)
      ? q.success
      : undefined,
  );

  return (
    <Screen tint={game.color} scene={decor} mascotVisit={!answered}>
      <GameHeader
        game={game}
        total={maxQuestion}
        results={results}
        current={store.currentIndex}
        replayDisabled={answered}
        prompt={`Combien ${animalSound.label} ?`}
        promptSize={22}
        onHome={() => {
          navigation.popTo('Home');
        }}
      />
      <View
        pointerEvents="box-none"
        style={[
          styles.content,
          {gap: 22 * scale},
          answered && {paddingBottom: 210 * scale},
        ]}>
        <CountField count={answer} animal={animal} />
        <View style={[styles.choices, {gap: 12 * scale}]}>
          {question?.possibilities?.map((possibility) => (
            <View key={possibility.value} style={styles.choiceCell}>
              <Tile
                type="number"
                value={possibility.value.toString()}
                deepColor={game.deep}
                contentSize={40 * scale}
                state={
                  !answered
                    ? 'idle'
                    : possibility.isGood
                      ? 'right'
                      : possibility.value === picked
                        ? 'wrong'
                        : 'dim'
                }
                disabled={answered || audioLoading}
                onPress={() => {
                  store.answer(possibility.isGood);
                  setPicked(possibility.value);
                }}
              />
            </View>
          ))}
        </View>
      </View>
      {correct && <Confetti />}
      <ResultSheet
        visible={answered}
        success={question.success}
        answerLabel={answer.toString()}
        last={!store.hasMoreQuestion()}
        sound={responseSoundMap[answer]}
        choice={picked?.toString()}
        answer={answer.toString()}
        questionId={questionId}
        gameId={gameId}
        onNext={() => {
          if (!store.hasMoreQuestion()) {
            navigation.replace('Score', {gameId, gameType: 'number'});
            return;
          }
          setQuestionId(uuid.v4());
          store.nextQuestion();
          setPicked(null);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  countField: {
    borderRadius: 32,
    backgroundColor: '#fff',
    overflow: 'hidden',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    elevation: 6,
  },
  countGlow: {
    position: 'absolute',
    left: -12,
    right: -12,
    borderRadius: 100,
    opacity: 0.25,
  },
  choices: {
    flexDirection: 'row',
  },
  choiceCell: {
    flex: 1,
  },
});
