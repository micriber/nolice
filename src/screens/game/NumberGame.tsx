import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AudioSource} from 'expo-audio';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';

import ChoiceButton from './ChoiceButton';
import {AnimalImage} from './animal-picture';
import {ResultModal} from './result-modal';
import InstructionButton from '../../components/InstructionButton';
import MusicButton from '../../components/MusicButton';
import ProgressDots from '../../components/ProgressDots';
import {SOUNDS_COUNT_QUESTION, useSoundStore} from '../../store/audio';
import {useGameScoreStore} from '../../store/game';
import {shuffle} from '../../utils/array';
import COLORS from '../../utils/color';
import FONT from '../../utils/font';
import {getRandomInt} from '../../utils/random';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

enum Animal {
  duck,
  rabbit,
  dog,
  pig,
  cow,
  cat,
  bird,
  sheep,
}

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
};

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

export function NumberGame({navigation}: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [animals, setAnimals] = useState(['duck']);
  const store = useGameScoreStore();
  const soundStore = useSoundStore();
  const [choice, setChoice] = useState('choice');
  const [questionId, setQuestionId] = useState(uuid.v4() as string);
  const [gameId] = useState(uuid.v4() as string);

  const maxQuestion = 10;
  const maxAnswer = 9;
  const nbAnimals = Object.keys(Animal).length / 2;

  function generateAnimals() {
    let animals: string[] = [];
    for (let i = 0; animals.length < maxQuestion; i++) {
      if (i === nbAnimals) {
        i = getRandomInt(nbAnimals - 1);
      }
      animals.push(Animal[i]);
    }
    do {
      animals = shuffle(animals);
    } while (animals.some((v, i, a) => v === a[i + 1]));
    setAnimals(animals);
  }

  useEffect(() => {
    store.init(maxQuestion, maxAnswer);
    generateAnimals();
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const playAudio = async () => {
      return await soundStore.play(sound);
    };

    if (isLoaded) {
      playAudio();
      logEvent(getAnalytics(), 'question', {
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
    }
  }, [isLoaded, store.currentIndex]);

  if (!isLoaded) return <></>;

  const question = store.questions[store.currentIndex];
  const answer = question?.answer;
  const animal = animals[store.currentIndex];
  const animalsElements = answer
    ? Array.from({length: answer}, (_, i) => (
        <AnimalImage key={i} type={animal} />
      ))
    : [];
  const {sound} = animalSoundMap[animal];

  return (
    <SafeAreaView style={styles.container}>
      <ResultModal
        answer={answer.toString()}
        onNext={() => {
          if (!store.hasMoreQuestion()) {
            setModalVisible(false);
            return navigation.navigate('Score', {gameId});
          }
          setQuestionId(uuid.v4() as string);
          store.nextQuestion();
          setModalVisible(false);
        }}
        success={question.success}
        visible={modalVisible}
        questionId={questionId}
        gameId={gameId}
        sound={responseSoundMap[answer]}
        choice={choice}>
        <View style={styles.modalAnswer}>
          <Text style={styles.modalAnswerText}>{answer}</Text>
        </View>
      </ResultModal>

      <View style={styles.progress}>
        <ProgressDots
          questions={store.questions}
          currentIndex={store.currentIndex}
        />
      </View>

      <View style={styles.animalsArea}>
        <View style={styles.animalsGrid}>{animalsElements}</View>
      </View>

      <View style={styles.choicesArea}>
        <View style={styles.choicesGrid}>
          {question?.possibilities?.map((possibility) => (
            <ChoiceButton
              type="number"
              key={possibility.value}
              value={possibility.value.toString()}
              onPress={() => {
                question.success = possibility.isGood;
                setChoice(possibility.value.toString());
                setModalVisible(true);
              }}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        {sound !== undefined ? <InstructionButton sound={sound} /> : null}
        <MusicButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: RFPercentage(2),
    paddingTop: RFPercentage(3),
  },
  progress: {
    paddingVertical: RFPercentage(1),
  },
  animalsArea: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE,
    borderRadius: RFPercentage(2.5),
    marginHorizontal: RFPercentage(1),
    padding: RFPercentage(1),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  animalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  choicesArea: {
    flex: 4,
    justifyContent: 'center',
  },
  choicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: RFPercentage(1),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: RFPercentage(6),
    paddingBottom: RFPercentage(2),
    paddingTop: RFPercentage(1),
  },
  modalAnswer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAnswerText: {
    fontSize: FONT.SIZE.GIANT,
    fontFamily: FONT.FAMILY,
    color: COLORS.FONT.BASE,
  },
});
