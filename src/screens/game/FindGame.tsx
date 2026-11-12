import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {useNavigation, useRoute} from '@react-navigation/core';
import * as Sentry from '@sentry/react-native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import uuid from 'react-native-uuid';

import GameHeader from './GameHeader';
import Tile from './Tile';
import {COLOR_HEX} from './color-picture';
import {ResultSheet} from './result-sheet';
import {SHAPE_COLORS} from './shape-picture';
import Confetti from '../../components/Confetti';
import Screen from '../../components/Screen';
import {useSoundStore, SOUNDS_QUESTION} from '../../store/audio';
import {useGameScoreStore} from '../../store/game';
import {useSettingsStore} from '../../store/settings';
import {gameConfig} from '../../utils/color';
import {useScale} from '../../utils/scale';
import {FindGameScreenRouteProp, NavigationProp} from '../types';

export function FindGame() {
  const route = useRoute<FindGameScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const {questionConfig, gameType} = route.params;
  const store = useGameScoreStore();
  const playSound = useSoundStore((s) => s.play);
  const stopSound = useSoundStore((s) => s.stop);
  const audioLoading = useSoundStore((s) => s.audioLoading);
  const decor = useSettingsStore((s) => s.decor);
  const scale = useScale();
  const [isLoaded, setIsLoaded] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [questionId, setQuestionId] = useState(uuid.v4());
  const [gameId] = useState(uuid.v4());
  const [shapeColor, setShapeColor] = useState(
    () => SHAPE_COLORS[Math.floor(Math.random() * SHAPE_COLORS.length)],
  );

  const game = gameConfig(gameType);
  const maxQuestion = 10;
  const maxAnswer = questionConfig.length - 1;

  useEffect(() => {
    store.init(maxQuestion, maxAnswer, 0, false);
    setIsLoaded(true);
    return () => {
      stopSound();
    };
  }, []);

  const question = store.questions[store.currentIndex];
  const configItem = question ? questionConfig[question.answer] : undefined;
  const sound = configItem
    ? SOUNDS_QUESTION[gameType.toUpperCase()]?.[configItem.key.toUpperCase()]
    : undefined;
  const possibilitiesValid =
    question?.possibilities?.every((p) => questionConfig[p.value]) ?? false;

  useEffect(() => {
    if (!isLoaded || !configItem || !sound || !possibilitiesValid) return;
    const playAudio = async () => {
      await playSound(sound.QUESTION);
    };
    playAudio().catch((err: any) => {
      Sentry.logger.error('Audio error: FindGame question play', {
        error: err?.message ?? String(err),
      });
      Sentry.captureException(err);
    });
    void logEvent(getAnalytics(), 'question', {
      event_name: 'question',
      question_id: questionId,
      game_id: gameId,
      gameType,
      answer: configItem.key,
      possibility1: questionConfig[question?.possibilities[0].value]?.key,
      possibility2: questionConfig[question?.possibilities[1].value]?.key,
      possibility3: questionConfig[question?.possibilities[2].value]?.key,
      possibility4: questionConfig[question?.possibilities[3].value]?.key,
    });
  }, [isLoaded, store.currentIndex]);

  if (!isLoaded || !configItem || !sound || !possibilitiesValid) return <></>;
  const {label, key} = configItem;

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
        prompt={`Trouve ${label}`}
        onHome={() => {
          navigation.popTo('Home');
        }}
      />
      <View
        pointerEvents="box-none"
        style={[styles.content, answered && {paddingBottom: 210 * scale}]}>
        <View style={[styles.choices, {gap: 16 * scale}]}>
          {question?.possibilities?.map((possibility) => (
            <View key={possibility.value} style={styles.choiceCell}>
              <Tile
                type={gameType}
                value={questionConfig[possibility.value].key}
                deepColor={game.deep}
                contentSize={96 * scale}
                shapeColor={gameType === 'shape' ? shapeColor : undefined}
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
        answerLabel={label}
        swatch={gameType === 'color' ? COLOR_HEX[key] : undefined}
        last={!store.hasMoreQuestion()}
        sound={sound.ANSWER}
        choice={picked !== null ? questionConfig[picked]?.key : undefined}
        answer={key}
        questionId={questionId}
        gameId={gameId}
        onNext={() => {
          if (!store.hasMoreQuestion()) {
            navigation.replace('Score', {gameId, gameType});
            return;
          }
          setQuestionId(uuid.v4());
          if (gameType === 'shape') {
            const colors = SHAPE_COLORS.filter((color) => color !== shapeColor);
            setShapeColor(colors[Math.floor(Math.random() * colors.length)]);
          }
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
  choices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  choiceCell: {
    width: '45%',
  },
});
