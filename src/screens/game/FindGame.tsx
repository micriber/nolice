import {StyleSheet, Text, View} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import React, {useEffect, useState} from "react";
import ChoiceButton from "./ChoiceButton";
import {useGameScoreStore} from "../../store/game";
import {ResultModal} from "./result-modal";
import {useSoundStore} from "../../store/audio";
import MusicButton from "../../components/MusicButton";
import COLORS from "../../utils/color";
import FONT from "../../utils/font";
import analytics from "@react-native-firebase/analytics";
import {RFPercentage} from "react-native-responsive-fontsize";
import InstructionButton from "../../components/InstructionButton";
import {AVPlaybackSource} from "expo-av";
import uuid from 'react-native-uuid';

type QuestionConfig = {
  key: string;
  label: string;
  sound: AVPlaybackSource;
};

type Props = {
  route: {params: {questionConfig: QuestionConfig[], gameType: string}};
  navigation: NativeStackNavigationProp<any>;
};

export function FindGame({ route, navigation } : Props) {
  const { questionConfig,gameType} = route.params;
  const store = useGameScoreStore()
  const soundStore = useSoundStore()
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [choice, setChoice] = useState('choice');
  const [questionId, setQuestionId] = useState(uuid.v4());
  const [gameId, setGameId] = useState(uuid.v4());

  const maxQuestion = 10;
  const maxAnswer = questionConfig.length - 1;

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
      analytics().logEvent('question', {
        event_name: 'question',
        question_id: questionId,
        game_id: gameId,
        gameType: gameType,
        answer: questionConfig[question.answer].key,
        possibility1: questionConfig[question?.possibilities[0].value].key,
        possibility2: questionConfig[question?.possibilities[1].value].key,
        possibility3: questionConfig[question?.possibilities[2].value].key,
        possibility4: questionConfig[question?.possibilities[3].value].key,
      })
    }
  }, [isLoaded, store.currentIndex])

  if (!isLoaded) return <></>;

  const question = store.questions[store.currentIndex];
  const { label, sound, key} = questionConfig[question.answer];

  return (
    <View style={styles.container}>
      <ResultModal onNext={() => {
        if (!store.hasMoreQuestion()) {
          setModalVisible(false)
          return navigation.navigate('Score', {gameId})
        }
        setQuestionId(uuid.v4());
        store.nextQuestion()
        setModalVisible(false)
      }} success={question.success} visible={modalVisible} questionId={questionId} gameId={gameId} choice={choice} answer={key}>
        <ChoiceButton key={question.answer} type={gameType} value={key} onPress={() => {}}/>
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
            <ChoiceButton key={possibility.value} type={gameType} value={questionConfig[possibility.value].key} onPress={() => {
              question.success = possibility.isGood
              setChoice(questionConfig[possibility.value].key)
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
