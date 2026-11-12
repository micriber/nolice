import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {AudioSource} from 'expo-audio';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';

import BigButton from '../../components/BigButton';
import Mascot from '../../components/Mascot';
import {SOUNDS, useSoundStore} from '../../store/audio';
import {NOL, shade} from '../../utils/color';
import FONT from '../../utils/font';
import {useScale} from '../../utils/scale';

type Props = {
  visible: boolean;
  success: boolean;
  // libellé de la bonne réponse (« le canard », « 4 », …)
  answerLabel: string;
  // pastille de couleur à côté du libellé (jeu des couleurs)
  swatch?: string;
  last: boolean;
  onNext: () => void;
  sound: AudioSource;
  choice?: string;
  answer?: string;
  questionId?: string;
  gameId?: string;
};

// Feuille de résultat en bas d'écran (remplace l'ancienne modale plein écran) :
// mascotte contente/triste, « Bravo ! » / « Presque ! », bonne réponse,
// bouton Continuer révélé quand les sons sont finis (contrat audio conservé).
export function ResultSheet(props: Props) {
  const playSound = useSoundStore((s) => s.play);
  const scale = useScale();
  const [soundFinished, setSoundFinished] = useState(false);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rise = useRef(new Animated.Value(0)).current;

  useEffect(
    () => () => {
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!props.visible) return;
    setSoundFinished(false);

    rise.setValue(0);
    Animated.timing(rise, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();

    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    safetyTimeoutRef.current = setTimeout(() => {
      setSoundFinished(true);
    }, 4000);

    void logEvent(getAnalytics(), 'result', {
      success: props.success,
      answer: props.answer,
      choice: props.choice,
      question_id: props.questionId,
      game_id: props.gameId,
    });
    void playSound(props.success ? SOUNDS.BRAVO : SOUNDS.DOMMAGE, () => {
      void playSound(props.sound, () => {
        setSoundFinished(true);
      });
    });
  }, [props.visible]);

  if (!props.visible) return null;

  const accent = props.success ? NOL.mint : NOL.coral;
  const accentDeep = props.success ? NOL.mintDeep : NOL.coralDeep;

  return (
    <Animated.View
      style={[
        styles.sheet,
        {
          borderTopLeftRadius: 34 * scale,
          borderTopRightRadius: 34 * scale,
          paddingTop: 20 * scale,
          paddingHorizontal: 22 * scale,
          paddingBottom: 30 * scale,
          transform: [
            {
              translateY: rise.interpolate({
                inputRange: [0, 1],
                outputRange: [260 * scale, 0],
              }),
            },
          ],
        },
      ]}>
      <View style={[styles.row, {gap: 14 * scale, marginBottom: 16 * scale}]}>
        <View
          style={[
            styles.mascotBubble,
            {
              width: 64 * scale,
              height: 64 * scale,
              borderRadius: 32 * scale,
              backgroundColor: shade(accent, 0.78),
            },
          ]}>
          <Mascot
            size={58 * scale}
            mood={props.success ? 'happy' : 'sad'}
            anim={props.success ? 'jump' : 'bob'}
          />
        </View>
        <View style={styles.texts}>
          <Text
            style={[
              styles.headline,
              {color: accentDeep, fontSize: 26 * scale, lineHeight: 30 * scale},
            ]}>
            {props.success ? 'Bravo !' : 'Dommage !'}
          </Text>
          <View style={[styles.answerRow, {marginTop: 5 * scale}]}>
            <Text style={[styles.answerLabel, {fontSize: 15 * scale}]}>
              La réponse :{' '}
            </Text>
            {props.swatch ? (
              <View
                style={[
                  styles.swatch,
                  {
                    width: 18 * scale,
                    height: 18 * scale,
                    borderRadius: 9 * scale,
                    marginRight: 6 * scale,
                    backgroundColor: props.swatch,
                  },
                ]}
              />
            ) : null}
            <Text
              style={[styles.answerValue, {fontSize: 15 * scale}]}
              numberOfLines={1}>
              {props.answerLabel}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{opacity: soundFinished ? 1 : 0}}
        pointerEvents={soundFinished ? 'auto' : 'none'}>
        <BigButton
          label={props.last ? 'Voir mon score' : 'Continuer'}
          color={accent}
          deep={accentDeep}
          onPress={props.onNext}
          scale={scale}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 70,
    backgroundColor: '#fff',
    elevation: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mascotBubble: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
  },
  headline: {
    fontFamily: FONT.DISPLAY_BOLD,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerLabel: {
    fontFamily: FONT.UI,
    color: NOL.inkSoft,
  },
  swatch: {
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 1,
  },
  answerValue: {
    fontFamily: FONT.UI_HEAVY,
    color: NOL.ink,
  },
});
