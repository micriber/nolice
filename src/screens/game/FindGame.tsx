import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {useNavigation, useRoute} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';

import ChoiceButton from './ChoiceButton';
import {ResultModal} from './result-modal';
import InstructionButton from '../../components/InstructionButton';
import MusicButton from '../../components/MusicButton';
import ProgressDots from '../../components/ProgressDots';
import {useSoundStore, SOUNDS_QUESTION} from '../../store/audio';
import {useGameScoreStore} from '../../store/game';
import COLORS from '../../utils/color';
import {FindGameScreenRouteProp} from '../menu/types';
import {NavigationProp} from '../types';

export function FindGame() {
  const route = useRoute<FindGameScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const {questionConfig, gameType} = route.params;
  const store = useGameScoreStore();
  const soundStore = useSoundStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [choice, setChoice] = useState('choice');
  const [questionId, setQuestionId] = useState(uuid.v4() as string);
  const [gameId] = useState(uuid.v4() as string);

  const maxQuestion = 10;
  const maxAnswer = questionConfig.length - 1;

  useEffect(() => {
    store.init(maxQuestion, maxAnswer);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const playAudio = async () => {
      return await soundStore.play(sound.QUESTION);
    };

    if (isLoaded) {
      playAudio().catch(console.error);
      logEvent(getAnalytics(), 'question', {
        event_name: 'question',
        question_id: questionId,
        game_id: gameId,
        gameType,
        answer: questionConfig[question.answer].key,
        possibility1: questionConfig[question?.possibilities[0].value].key,
        possibility2: questionConfig[question?.possibilities[1].value].key,
        possibility3: questionConfig[question?.possibilities[2].value].key,
        possibility4: questionConfig[question?.possibilities[3].value].key,
      });
    }
  }, [isLoaded, store.currentIndex]);

  if (!isLoaded) return <></>;

  const question = store.questions[store.currentIndex];
  const {key} = questionConfig[question.answer];
  const sound = SOUNDS_QUESTION[gameType.toUpperCase()][key.toUpperCase()];

  return (
    <SafeAreaView style={styles.container}>
      <ResultModal
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
        answer={key}
        sound={sound.ANSWER}>
        <ChoiceButton
          key={question.answer}
          type={gameType}
          value={key}
          onPress={() => {}}
        />
      </ResultModal>

      <View style={styles.progress}>
        <ProgressDots
          questions={store.questions}
          currentIndex={store.currentIndex}
        />
      </View>

      <View style={styles.choicesArea}>
        <View style={styles.choicesGrid}>
          {question?.possibilities?.map((possibility) => (
            <ChoiceButton
              key={possibility.value}
              type={gameType}
              value={questionConfig[possibility.value].key}
              onPress={() => {
                question.success = possibility.isGood;
                setChoice(questionConfig[possibility.value].key);
                setModalVisible(true);
              }}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        {sound.QUESTION !== undefined ? (
          <InstructionButton sound={sound.QUESTION} />
        ) : null}
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
  choicesArea: {
    flex: 1,
    justifyContent: 'center',
  },
  choicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: RFPercentage(2),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: RFPercentage(6),
    paddingBottom: RFPercentage(2),
    paddingTop: RFPercentage(1),
  },
});
