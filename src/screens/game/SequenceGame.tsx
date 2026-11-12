import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import uuid from 'react-native-uuid';

import GameHeader from './GameHeader';
import Tile from './Tile';
import {AnimalImage} from './animal-picture';
import {QUESTION_CONFIGS} from './question-config';
import {ResultSheet} from './result-sheet';
import {SHAPE_COLORS, ShapeImage} from './shape-picture';
import Confetti from '../../components/Confetti';
import Screen from '../../components/Screen';
import {SOUNDS, SOUNDS_SEQUENCE_ANSWER, useSoundStore} from '../../store/audio';
import {useGameScoreStore} from '../../store/game';
import {useSettingsStore} from '../../store/settings';
import {shuffle} from '../../utils/array';
import {gameConfig, shade} from '../../utils/color';
import FONT from '../../utils/font';
import {useScale} from '../../utils/scale';
import {
  Sequence,
  SequenceImage,
  SequenceKind,
  makeSequences,
} from '../../utils/sequence';
import {NavigationProp} from '../types';

type Props = {
  navigation: NavigationProp;
};

const MAX_QUESTION = 10;

const ITEMS: Record<SequenceKind, string[]> = {
  animal: QUESTION_CONFIGS.animal.map((item) => item.key),
  shape: QUESTION_CONFIGS.shape.map((item) => item.key),
};

const game = gameConfig('sequence');

const labelOf = (image: SequenceImage) =>
  QUESTION_CONFIGS[image.kind].find((item) => item.key === image.key)?.label ??
  '';

type Palette = Record<string, string>;

// Une couleur par forme de la question, toutes différentes.
function drawPalette(sequence: Sequence): Palette {
  const colors = shuffle([...SHAPE_COLORS]);
  return Object.fromEntries(
    sequence.choices
      .filter((image) => image.kind === 'shape')
      .map((image, i) => [image.key, colors[i]]),
  );
}

function Picture({
  image,
  size,
  palette,
}: {
  image: SequenceImage;
  size: number;
  palette: Palette;
}) {
  return image.kind === 'animal' ? (
    <AnimalImage type={image.key} size={size} />
  ) : (
    <ShapeImage type={image.key} size={size} color={palette[image.key]} />
  );
}

// Carte blanche avec la suite, sur une ligne ; la dernière case attend la réponse et la montre une fois donnée.
function SequenceRow({
  sequence,
  palette,
  revealed,
}: {
  sequence: Sequence;
  palette: Palette;
  revealed: boolean;
}) {
  const scale = useScale();
  const [width, setWidth] = useState(0);
  const gap = 6 * scale;
  const padding = 14 * scale;
  const cells = sequence.shown.length + 1;
  const size = Math.max(0, (width - padding * 2 - gap * (cells - 1)) / cells);
  return (
    <View
      onLayout={(event) => {
        setWidth(event.nativeEvent.layout.width);
      }}
      style={[styles.row, {gap, padding, borderRadius: 28 * scale}]}>
      {size > 0 && (
        <>
          {sequence.shown.map((image, i) => (
            <Picture key={i} image={image} size={size} palette={palette} />
          ))}
          <View
            style={[
              styles.slot,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderColor: game.deep,
                backgroundColor: shade(game.color, 0.8),
              },
            ]}>
            {revealed ? (
              <Picture
                image={sequence.answer}
                size={size * 0.78}
                palette={palette}
              />
            ) : (
              <Text
                style={[
                  styles.unknown,
                  {fontSize: size * 0.6, color: game.deep},
                ]}>
                ?
              </Text>
            )}
          </View>
        </>
      )}
    </View>
  );
}

export function SequenceGame({navigation}: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [sequences] = useState(() => makeSequences(MAX_QUESTION, ITEMS));
  const [palettes] = useState(() => sequences.map(drawPalette));
  const store = useGameScoreStore();
  const playSound = useSoundStore((s) => s.play);
  const stopSound = useSoundStore((s) => s.stop);
  const audioLoading = useSoundStore((s) => s.audioLoading);
  const decor = useSettingsStore((s) => s.decor);
  const scale = useScale();
  const [picked, setPicked] = useState<number | null>(null);
  const [questionId, setQuestionId] = useState(uuid.v4());
  const [gameId] = useState(uuid.v4());

  useEffect(() => {
    store.start(
      sequences.map((sequence) => ({
        answer: sequence.choices.indexOf(sequence.answer),
        success: false,
        possibilities: sequence.choices.map((choice, value) => ({
          value,
          isGood: choice === sequence.answer,
        })),
      })),
    );
    setIsLoaded(true);
    return () => {
      stopSound();
    };
  }, []);

  const question = store.questions[store.currentIndex];
  const sequence = sequences[store.currentIndex];
  const palette = palettes[store.currentIndex];

  useEffect(() => {
    if (!isLoaded || !question || !sequence) return;
    void playSound(SOUNDS.SEQUENCE);
    void logEvent(getAnalytics(), 'question', {
      event_name: 'question',
      question_id: questionId,
      game_id: gameId,
      gameType: 'sequence',
      answer: sequence.answer.key,
      possibility1: sequence.choices[0].key,
      possibility2: sequence.choices[1].key,
      possibility3: sequence.choices[2].key,
      possibility4: sequence.choices[3].key,
    });
  }, [isLoaded, store.currentIndex]);

  if (!isLoaded || !question || !sequence) return <></>;

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
        total={MAX_QUESTION}
        results={results}
        current={store.currentIndex}
        replayDisabled={answered}
        prompt="Qu’est-ce qui vient après ?"
        promptSize={22}
        onHome={() => {
          navigation.popTo('Home');
        }}
      />
      <View
        pointerEvents="box-none"
        style={[
          styles.content,
          {gap: 22 * scale},
          answered && {paddingBottom: 210 * scale},
        ]}>
        <SequenceRow
          sequence={sequence}
          palette={palette}
          revealed={answered}
        />
        <View style={[styles.choices, {gap: 16 * scale}]}>
          {question.possibilities.map((possibility) => (
            <View key={possibility.value} style={styles.choiceCell}>
              <Tile
                type={sequence.choices[possibility.value].kind}
                value={sequence.choices[possibility.value].key}
                deepColor={game.deep}
                contentSize={96 * scale}
                pictureColor={palette[sequence.choices[possibility.value].key]}
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
        answerLabel={labelOf(sequence.answer)}
        last={!store.hasMoreQuestion()}
        sound={SOUNDS_SEQUENCE_ANSWER[sequence.answer.key]}
        choice={picked !== null ? sequence.choices[picked].key : undefined}
        answer={sequence.answer.key}
        questionId={questionId}
        gameId={gameId}
        onNext={() => {
          if (!store.hasMoreQuestion()) {
            navigation.replace('Score', {gameId, gameType: 'sequence'});
            return;
          }
          setQuestionId(uuid.v4());
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
  row: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
  },
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  unknown: {
    fontFamily: FONT.DISPLAY_BOLD,
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
