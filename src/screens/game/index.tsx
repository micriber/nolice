import {StyleSheet, Text, View} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import React, {useEffect, useState} from "react";
import ChoiceButton from "./ChoiceButton";
import {AnimalImage} from "./animal-picture";
import {MAX_QUESTION, useGameScoreStore} from "../../store/game";
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

export default
function GameScreen({ navigation } : Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const store = useGameScoreStore()
  const soundStore = useSoundStore()
  const animals = []

  const question = store.questions[store.currentIndex];
  const answer = question?.possibilities.find((value) => value.isGood)
  if (answer) {
    for (let i = 0; i < answer.value; i++) {
      animals.push(<AnimalImage key={i} type={question.animal} />)
    }
  }

  let animalLabel;
  let sound: AVPlaybackSource;
  switch (question?.animal) {
    case "duck":
      animalLabel = "de canards";
      sound = SOUNDS.COUNT.DUCK;
      break;
    case "rabbit":
      animalLabel = "de lapins";
      sound = SOUNDS.COUNT.RABBIT;
      break;
    case "dog":
      animalLabel = "de chiens";
      sound = SOUNDS.COUNT.DOG;
      break;
    case "pig":
      animalLabel = "de cochons";
      sound = SOUNDS.COUNT.PIG;
      break;
    case "cow":
      animalLabel = "de vaches";
      sound = SOUNDS.COUNT.COW;
      break;
    case "cat":
      animalLabel = "de chats";
      sound = SOUNDS.COUNT.CAT;
      break;
    case "bird":
      animalLabel = "d'oiseaux";
      sound = SOUNDS.COUNT.BIRD;
      break;
    case "sheep":
      animalLabel = "de moutons";
      sound = SOUNDS.COUNT.SHEEP;
      break;
  }
  const questionLabel = `Combien comptes-tu ${animalLabel} ?`;

  useEffect(() => {
    const playAudio = async () => {
      return await soundStore.play(sound)
    }

    if (store.currentIndex < MAX_QUESTION) {
      playAudio()
      analytics().logEvent('question', {
        event_name: 'question',
        animal: question.animal,
        // @ts-ignore
        answer: question?.possibilities.find((value) => value.isGood).value,
        possibility1: question.possibilities[0].value,
        possibility2: question.possibilities[1].value,
        possibility3: question.possibilities[2].value,
        possibility4: question.possibilities[3].value,
      })
    }
  }, [store.currentIndex, sound, question])

  return (
    <View style={styles.container}>
      <ResultModal answer={answer?.value} onNext={() => {
        setModalVisible(false)
        store.nextQuestion(success)
        setSuccess(false)
        if (!store.hasNextQuestion()) {
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
          }}>Question {store.currentIndex + 1} sur {MAX_QUESTION}</Text>
        </View>
        <View style={[ {
          alignContent: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          flexWrap: 'wrap',
          flex: 8,
        }]}>
          {animals}
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
