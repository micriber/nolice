import {MaterialCommunityIcons} from '@expo/vector-icons';
import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {useNavigation, useRoute} from '@react-navigation/core';
import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';

import {ScoreScreenRouteProp} from './types';
import BigButton from '../../components/BigButton';
import Confetti from '../../components/Confetti';
import Mascot from '../../components/Mascot';
import Screen from '../../components/Screen';
import {SOUNDS, useSoundStore} from '../../store/audio';
import {useGameScoreStore} from '../../store/game';
import {useSettingsStore} from '../../store/settings';
import {NOL, gameConfig} from '../../utils/color';
import FONT from '../../utils/font';
import {NavigationProp} from '../types';

// Étoile qui apparaît en « pop » avec un délai.
function Star({
  earned,
  big,
  delay,
}: {
  earned: boolean;
  big: boolean;
  delay: number;
}) {
  const pop = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(pop, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.6)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  return (
    <Animated.View
      style={{
        opacity: earned ? pop : 0.35,
        transform: [
          {scale: pop.interpolate({inputRange: [0, 1], outputRange: [0.4, 1]})},
        ],
      }}>
      <MaterialCommunityIcons
        name="star"
        size={big ? 64 : 54}
        color={earned ? NOL.star : '#9FB4C2'}
      />
    </Animated.View>
  );
}

export default function ScoreScreen() {
  const route = useRoute<ScoreScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const store = useGameScoreStore();
  const playSound = useSoundStore((s) => s.play);
  const stopSound = useSoundStore((s) => s.stop);
  const decor = useSettingsStore((s) => s.decor);
  const maxQuestion = store.questions.length;
  const {gameId, gameType} = route.params;
  const game = gameConfig(gameType);

  const results = store.getResults();
  const isGood = results >= maxQuestion / 2;
  const isPerfect = results === maxQuestion;

  // Étoiles alignées sur les humeurs de la mascotte :
  // < 4 → 1★ (triste), 4–7 → 2★ (contente), ≥ 8 → 3★ (hyper contente)
  const stars = results >= 8 ? 3 : results >= 4 ? 2 : 1;
  const mood = results >= 8 ? 'happy' : results >= 4 ? 'content' : 'sad';

  const headline =
    mood === 'happy'
      ? 'Bravo !'
      : mood === 'content'
        ? 'Bien joué !'
        : 'Bien essayé !';
  const message =
    mood === 'happy'
      ? 'Incroyable, tu es un vrai champion !'
      : mood === 'content'
        ? 'Super travail, tu progresses vite !'
        : 'Pas grave, on apprend en essayant. On retente ?';

  useEffect(() => {
    void logEvent(getAnalytics(), 'score', {
      game_id: gameId,
      results,
      isGood,
      isPerfect,
    });
    void playSound(mood === 'sad' ? SOUNDS.RETRY : SOUNDS.CONGRATULATION);
    return () => {
      stopSound();
    };
  }, []);

  return (
    <Screen scene={decor}>
      {mood === 'happy' && <Confetti />}
      <View style={styles.content}>
        <Mascot
          size={150}
          mood={mood}
          anim={mood === 'happy' ? 'jump' : 'bob'}
        />
        <Text style={styles.headline} numberOfLines={1} adjustsFontSizeToFit>
          {headline}
        </Text>
        <View style={styles.stars}>
          <Star earned={stars >= 1} big={false} delay={200} />
          <Star earned={stars >= 2} big delay={380} />
          <Star earned={stars >= 3} big={false} delay={560} />
        </View>
        <View style={styles.scorePill}>
          <Text style={styles.scoreLabel}>Résultat</Text>
          <Text style={[styles.scoreValue, {color: game.deep}]}>{results}</Text>
          <Text style={styles.scoreTotal}>/ {maxQuestion}</Text>
        </View>
        <Text style={styles.message}>{message}</Text>
        {/* « Rejouer » = choisir un nouveau jeu → retour à la liste des jeux */}
        <BigButton
          label="Rejouer"
          color={NOL.sky}
          onPress={() => {
            navigation.popTo('Home');
          }}
          icon={
            <MaterialCommunityIcons
              name="home-variant"
              size={24}
              color="#fff"
            />
          }
          style={styles.replay}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  headline: {
    fontFamily: FONT.DISPLAY_BOLD,
    fontSize: 34,
    color: NOL.ink,
    marginTop: 14,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginTop: 18,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 26,
    marginTop: 24,
    elevation: 6,
  },
  scoreLabel: {
    fontFamily: FONT.UI_HEAVY,
    fontSize: 16,
    color: NOL.inkSoft,
  },
  scoreValue: {
    fontFamily: FONT.DISPLAY_BOLD,
    fontSize: 30,
    lineHeight: 34,
  },
  scoreTotal: {
    fontFamily: FONT.DISPLAY,
    fontSize: 22,
    color: NOL.iceDeep,
  },
  message: {
    fontFamily: FONT.UI,
    fontSize: 15.5,
    color: NOL.inkSoft,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
    marginTop: 18,
  },
  replay: {
    marginTop: 30,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 300,
  },
});
