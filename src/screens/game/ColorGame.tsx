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

enum Color {
  yellow,
  red,
  brown,
  blue,
  pink,
  green,
  black,
  purple,
  orange,
  gray,
}

type ColorSoundMap = {
  [color: string]: {
    label: string;
    sound: AVPlaybackSource;
  };
};

const colorSoundMap: ColorSoundMap = {
  "yellow": { label: "le jaune", sound: SOUNDS.COLOR.YELLOW },
  "red": { label: "le rouge", sound: SOUNDS.COLOR.RED },
  "brown": { label: "le marron", sound: SOUNDS.COLOR.BROWN },
  "blue": { label: "le bleu", sound: SOUNDS.COLOR.BLUE },
  "pink": { label: "le rose", sound: SOUNDS.COLOR.PINK },
  "green": { label: "le vert", sound: SOUNDS.COLOR.GREEN },
  "black": { label: "le noir", sound: SOUNDS.COLOR.BLACK },
  "purple": { label: "le voilet", sound: SOUNDS.COLOR.PURPLE },
  "orange": { label: "l'orange", sound: SOUNDS.COLOR.ORANGE },
  "gray": { label: "le gris", sound: SOUNDS.COLOR.GREY },
};

export function ColorGame({ navigation } : Props) {
  const store = useGameScoreStore()
  const soundStore = useSoundStore()
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const maxQuestion = 10;
  const maxAnswer = 9;
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
  const { label, sound } = colorSoundMap[Color[question.answer]];

  return (
    <View style={styles.container}>
      <ResultModal onNext={() => {
        if (!store.hasMoreQuestion()) {
          return navigation.navigate('Score')
        }
        store.nextQuestion()
        setModalVisible(false)
      }} success={question.success} visible={modalVisible}>
        <ChoiceButton key={question.answer} type={'color'} value={Color[question.answer]} onPress={() => {}}/>
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
          }}>Quelle couleur est {label} ?</Text>
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
            <ChoiceButton key={possibility.value} type={'color'} value={Color[possibility.value]} onPress={() => {
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
