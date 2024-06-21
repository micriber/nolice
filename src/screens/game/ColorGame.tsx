import {StyleSheet, Text, View} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import React, {useEffect, useState} from "react";
import ChoiceButton from "./ChoiceButton";
import {useGameScoreStore} from "../../store/game";
import {ResultModal} from "./result-modal";
import {SOUNDS, useSoundStore} from "../../store/audio";
import {AVPlaybackSource} from "expo-av";
import SoundButton from "../../components/SoundButton";
import COLORS from "../../utils/color";
import FONT from "../../utils/font";
import analytics from "@react-native-firebase/analytics";
import {RFPercentage} from "react-native-responsive-fontsize";

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
  "yellow": { label: "le jaune", sound: SOUNDS.COUNT.DUCK },
  "red": { label: "le rouge", sound: SOUNDS.COUNT.RABBIT },
  "brown": { label: "le marron", sound: SOUNDS.COUNT.DOG },
  "blue": { label: "le bleu", sound: SOUNDS.COUNT.PIG },
  "pink": { label: "le rose", sound: SOUNDS.COUNT.COW },
  "green": { label: "le vert", sound: SOUNDS.COUNT.CAT },
  "black": { label: "le noir", sound: SOUNDS.COUNT.BIRD },
  "purple": { label: "le voilet", sound: SOUNDS.COUNT.SHEEP },
  "orange": { label: "l'orange", sound: SOUNDS.COUNT.SHEEP },
  "gray": { label: "le gris", sound: SOUNDS.COUNT.SHEEP },
};

export function ColorGame({ navigation } : Props) {
  const store = useGameScoreStore()
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const maxQuestion = 10;
  const maxAnswer = 9;

  useEffect(() => {
    store.init(maxQuestion, maxAnswer)
    setIsLoaded(true)
  }, []);

  if (!isLoaded) return <></>;

  const question = store.questions[store.currentIndex];
  const colorLabel = colorSoundMap[Color[question.answer]].label;

  return (
    <View style={styles.container}>
      <ResultModal answer={colorLabel} onNext={() => {
        setModalVisible(false)
        if (store.currentIndex + 1 === maxQuestion) {
          return navigation.navigate('Score', {
            maxQuestion: maxQuestion,
          })
        }
        store.nextQuestion()
      }} success={question.success} visible={modalVisible}/>
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
          }}>Question {store.currentIndex + 1} sur 10</Text>
        </View>
        <View style={[ {
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          flexWrap: 'wrap',
          flex: 8
        }]}>
          <Text style={{
            fontSize: RFPercentage(4),
            fontFamily: FONT.FAMILY,
            color: COLORS.FONT.BASE,
            textAlign: 'center'
          }}>Quelle couleur est {colorSoundMap[Color[question.answer]].label} ?</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={{
          flexDirection: 'row',
          alignContent: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          flex: 3,
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
