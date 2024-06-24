import {StyleSheet, Text, View} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import React, {useEffect, useState} from "react";
import ChoiceButton from "./ChoiceButton";
import {useGameScoreStore} from "../../store/game";
import {ResultModal} from "./result-modal";
import {SOUNDS, useSoundStore} from "../../store/audio";
import {AVPlaybackSource} from "expo-av";
import MusicButton from "../../components/MusicButton";
import COLORS from "../../utils/color";
import FONT from "../../utils/font";
import analytics from "@react-native-firebase/analytics";
import {RFPercentage} from "react-native-responsive-fontsize";
import InstructionButton from "../../components/InstructionButton";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

enum Animal {
  bird,
  cat,
  cow,
  dog,
  duck,
  pig,
  rabbit,
  sheep,
}

type ColorSoundMap = {
  [color: string]: {
    label: string;
    sound: AVPlaybackSource;
  };
};

const animalSoundMap: ColorSoundMap = {
  "bird": { label: "l'oiseau", sound: SOUNDS.ANIMAL.BIRD },
  "cat": { label: "le chat", sound: SOUNDS.ANIMAL.CAT },
  "cow": { label: "la vache", sound: SOUNDS.ANIMAL.COW },
  "dog": { label: "le chien", sound: SOUNDS.ANIMAL.DOG },
  "duck": { label: "le canard", sound: SOUNDS.ANIMAL.DUCK },
  "pig": { label: "le cochon", sound: SOUNDS.ANIMAL.PIG },
  "rabbit": { label: "le lapin", sound: SOUNDS.ANIMAL.RABBIT },
  "sheep": { label: "le mouton", sound: SOUNDS.ANIMAL.MOUTON },
};

export function AnimalGame({ navigation } : Props) {
  const store = useGameScoreStore()
  const soundStore = useSoundStore()
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const maxQuestion = 10;
  const maxAnswer = 7;

  useEffect(() => {
    store.init(maxQuestion, maxAnswer)
    setIsLoaded(true)
  }, []);

  useEffect(() => {
    const playAudio = async () => {
      return await soundStore.play(sound)
    }

    if (isLoaded) {
      playAudio()
    }
  }, [isLoaded, store.currentIndex])

  if (!isLoaded) return <></>;

  const question = store.questions[store.currentIndex];
  const { label, sound } = animalSoundMap[Animal[question.answer]];

  return (
    <View style={styles.container}>
      <ResultModal onNext={() => {
        if (!store.hasMoreQuestion()) {
          return navigation.navigate('Score')
        }
        store.nextQuestion()
        setModalVisible(false)
      }} success={question.success} visible={modalVisible}>
        <ChoiceButton key={question.answer} type={'animal'} value={Animal[question.answer]} onPress={() => {}}/>
      </ResultModal>
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
          alignItems: 'center',
          flexDirection: 'row',
          flexWrap: 'wrap',
          flex: 3,
        }]}>
          <Text style={{
            fontSize: RFPercentage(4),
            fontFamily: FONT.FAMILY,
            color: COLORS.FONT.BASE,
            textAlign: 'center'
          }}>Trouve {label}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={{
          flexDirection: 'row',
          alignContent: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          flex: 3,
          gap: 20,
        }}>
          {question?.possibilities?.map((possibility) => (
            <ChoiceButton key={possibility.value} type={'animal'} value={Animal[possibility.value]} onPress={() => {
              question.success = possibility.isGood
              setModalVisible(true)
            }}/>
          ))}
        </View>
      </View>
      <View style={[styles.footer]}>
        {sound !== undefined ? <InstructionButton sound={sound}/> : null }
        <MusicButton/>
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
    flex: 2,
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 100,
    flex: 0.3,
    marginTop: -20,
    marginBottom: 30,
  }
});
