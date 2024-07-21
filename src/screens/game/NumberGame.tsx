import analytics from '@react-native-firebase/analytics';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import uuid from 'react-native-uuid';

import ChoiceButton from './ChoiceButton';
import {AnimalImage} from './animal-picture';
import {ResultModal} from './result-modal';
import MusicButton from '../../components/MusicButton';
import {SoundQuestionType, SOUNDS_QUESTION, useSoundStore} from '../../store/audio';
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
    sound: SoundQuestionType;
  };
};

const animalSoundMap: AnimalSoundMap = {
  duck: {label: 'de canards', sound: SOUNDS_QUESTION.COUNT.DUCK},
  rabbit: {label: 'de lapins', sound: SOUNDS_QUESTION.COUNT.RABBIT},
  dog: {label: 'de chiens', sound: SOUNDS_QUESTION.COUNT.DOG},
  pig: {label: 'de cochons', sound: SOUNDS_QUESTION.COUNT.PIG},
  cow: {label: 'de vaches', sound: SOUNDS_QUESTION.COUNT.COW},
  cat: {label: 'de chats', sound: SOUNDS_QUESTION.COUNT.CAT},
  bird: {label: "d'oiseaux", sound: SOUNDS_QUESTION.COUNT.BIRD},
  sheep: {label: 'de moutons', sound: SOUNDS_QUESTION.COUNT.SHEEP},
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
      analytics().logEvent('question', {
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
  const {label, sound} = animalSoundMap[animal];
  const questionLabel = `Combien comptes-tu ${label} ?`;

  return (
    <View style={styles.container}>
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
        choice={choice}
      />
      <View style={[styles.header]}>
        <View
          style={[
            {
              flex: 1.5,
              flexDirection: 'row',
            },
          ]}>
          <Text
            style={{
              fontSize: RFPercentage(4),
              fontFamily: FONT.FAMILY,
              color: COLORS.FONT.BASE,
              flex: 3,
            }}>
            Question {store.currentIndex + 1} sur {maxQuestion}
          </Text>
        </View>
        <View
          style={[
            {
              alignContent: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
              flex: 8,
            },
          ]}>
          {animalsElements}
        </View>
      </View>
      <View style={styles.body}>
        <View
          style={[
            {
              flex: 1,
              marginBottom: '5%',
            },
          ]}>
          <Text
            style={{
              fontSize: RFPercentage(4),
              fontFamily: FONT.FAMILY,
              color: COLORS.FONT.BASE,
              textAlign: 'center',
            }}>
            {questionLabel}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            flex: 3.5,
            gap: 20,
            marginTop: -20,
          }}>
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
      <View style={[styles.footer]}>
        <MusicButton />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  header: {
    flex: 1,
  },
  body: {
    flex: 1.1,
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'flex-end',
    flex: 0.2,
    marginTop: -20,
  },
});
