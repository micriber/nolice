import {StyleSheet, Text, View} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import React, {useEffect, useState} from "react";
import ChoiceButton from "./ChoiceButton";
import {AnimalImage} from "./animal-picture";
import {newQuestion, useGameScoreStore} from "../../store/game";
import {ResultModal} from "./result-modal";
import {SOUNDS, useSoundStore} from "../../store/audio";
import {AVPlaybackSource} from "expo-av";
import SoundButton from "../../components/SoundButton";
import COLORS from "../../utils/color";
import FONT from "../../utils/font";
import analytics from "@react-native-firebase/analytics";
import {RFPercentage} from "react-native-responsive-fontsize";
import {getRandomInt} from "../../utils/random";
import {shuffle} from "../../utils/array";

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
    sound: AVPlaybackSource;
  };
};

const animalSoundMap: AnimalSoundMap = {
  "duck": { label: "de canards", sound: SOUNDS.COUNT.DUCK },
  "rabbit": { label: "de lapins", sound: SOUNDS.COUNT.RABBIT },
  "dog": { label: "de chiens", sound: SOUNDS.COUNT.DOG },
  "pig": { label: "de cochons", sound: SOUNDS.COUNT.PIG },
  "cow": { label: "de vaches", sound: SOUNDS.COUNT.COW },
  "cat": { label: "de chats", sound: SOUNDS.COUNT.CAT },
  "bird": { label: "d'oiseaux", sound: SOUNDS.COUNT.BIRD },
  "sheep": { label: "de moutons", sound: SOUNDS.COUNT.SHEEP },
};

export function NumberGame({ navigation } : Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [animals, setAnimals] = useState([Animal[1]]);
  const store = useGameScoreStore()
  const soundStore = useSoundStore()

  const maxQuestion = 10;
  const maxAnswer = 9;
  const nbAnimals = Object.keys(Animal).length / 2;

  function generateAnimals() {
    let animals: string[] = []
    for (let i = 0; animals.length < maxQuestion; i++) {
      if (i == nbAnimals) {
        i = getRandomInt(nbAnimals - 1)
      }
      animals.push(Animal[i])
    }
    do {
      animals = shuffle(animals);
    } while (animals.some((v, i, a) => v === a[i + 1]));
    setAnimals(animals)
  }

  useEffect(() => {
    store.init(maxQuestion, maxAnswer)
    generateAnimals();
    setIsLoaded(true)
  }, []);

  const question = store.questions[store.currentIndex];
  const answer = question?.answer
  const animal = animals[store.currentIndex];
  const animalsElements = answer ? Array.from({ length: answer }, (_, i) => <AnimalImage key={i} type={animal} />) : [];

  const { label, sound } = animalSoundMap[animal];
  const questionLabel = `Combien comptes-tu ${label} ?`;

  useEffect(() => {
    const playAudio = async () => {
      return await soundStore.play(sound)
    }

    if (isLoaded) {
      playAudio()
      analytics().logEvent('question', {
        event_name: 'question',
        // animal: question.animal,
        // @ts-ignore
        answer: question?.possibilities.find((value) => value.isGood).value,
        possibility1: question?.possibilities[0].value,
        possibility2: question?.possibilities[1].value,
        possibility3: question?.possibilities[2].value,
        possibility4: question?.possibilities[3].value,
      })
    }
  }, [isLoaded, store.currentIndex, sound, question])

  if (!isLoaded) return <></>;
  return (
    <View style={styles.container}>
      <ResultModal answer={answer} onNext={() => {
        setModalVisible(false)
        store.nextQuestion(success)
        setSuccess(false)
        if (store.currentIndex === maxQuestion) {
          return navigation.navigate('Score')
        }
      }} success={success} visible={modalVisible}/>
      <View style={[styles.header]}>
        <View style={[{
          flex: 1,
          flexDirection: 'row',
        }]}>
          <Text style={{
            fontSize: RFPercentage(4),
            fontFamily: FONT.FAMILY,
            color: COLORS.FONT.BASE,
            flex: 3,
          }}>Question {store.currentIndex + 1} sur {maxQuestion}</Text>
        </View>
        <View style={[ {
          alignContent: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          flexWrap: 'wrap',
          flex: 8,
        }]}>
          {animalsElements}
        </View>
      </View>
      <View style={styles.body}>
        <View style={[
          {
            flex: 1,
            marginBottom: '5%',
          }
        ]}>
          <Text style={{
            fontSize: RFPercentage(4),
            fontFamily: FONT.FAMILY,
            color: COLORS.FONT.BASE,
            textAlign: 'center',
          }}>{questionLabel}</Text>
        </View>
        <View style={{
          flexDirection: 'row',
          alignContent: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          flex: 3,
        }}>
          {question?.possibilities?.map((possibility) => (
            <ChoiceButton key={possibility.value} value={possibility.value.toString()} onPress={() => {
              setModalVisible(true)
              setSuccess(possibility.isGood)
            }}/>
          ))}
        </View>
      </View>
      <View style={[styles.footer]}>
        <SoundButton/>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: 20,
    paddingTop: 40,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  header: {
    flex: 1,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'flex-end',
    flex: 0.2,
    marginTop: -20,
  }
});
