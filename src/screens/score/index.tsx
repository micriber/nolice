import {MaterialCommunityIcons} from '@expo/vector-icons';
import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {useNavigation, useRoute} from '@react-navigation/core';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {ScoreScreenRouteProp} from './types';
import BigButton from '../../components/BigButton';
import Confetti from '../../components/Confetti';
import DecorThumb from '../../components/DecorThumb';
import {DECOR_LABELS} from '../../components/IceBg';
import Mascot, {MASCOTS} from '../../components/Mascot';
import Screen from '../../components/Screen';
import {MUSIC_TRACKS, SOUNDS, useSoundStore} from '../../store/audio';
import {useGameScoreStore} from '../../store/game';
import {useRewardsStore} from '../../store/rewards';
import {useSettingsStore} from '../../store/settings';
import {NOL, gameConfig, shade} from '../../utils/color';
import FONT from '../../utils/font';
import {Reward, SUCCESS_SCORE} from '../../utils/rewards';
import {TRACK_CHOICES} from '../../utils/tracks';
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

function rewardLook(reward: Reward) {
  switch (reward.kind) {
    case 'mascot':
      return {
        title: 'Nouvelle mascotte !',
        name: MASCOTS.find((m) => m.key === reward.key)?.label,
        picture: <Mascot size={58} who={reward.key} anim="none" />,
      };
    case 'decor':
      return {
        title: 'Nouveau décor !',
        name: DECOR_LABELS[reward.key],
        picture: (
          <View style={styles.rewardDecor}>
            <DecorThumb scene={reward.key} unit={0.7} radius={10} />
          </View>
        ),
      };
    case 'track': {
      const track = TRACK_CHOICES.find((t) => t.key === reward.key);
      return {
        title: 'Nouvelle musique !',
        name: track?.label,
        picture: (
          <MaterialCommunityIcons
            name={track?.icon ?? 'music'}
            size={52}
            color={track?.color ?? NOL.sky}
          />
        ),
      };
    }
  }
}

// Récompense gagnée avec cette partie, qui apparaît en « pop » après les étoiles : la toucher la choisit.
function RewardCard({reward}: {reward: Reward}) {
  const pop = useRef(new Animated.Value(0)).current;
  const chosen = useSettingsStore(
    (s) =>
      (reward.kind === 'mascot'
        ? s.mascot
        : reward.kind === 'decor'
          ? s.decor
          : s.musicTrack) === reward.key,
  );
  const setSetting = useSettingsStore((s) => s.setSetting);
  const startBackground = useSoundStore((s) => s.startBackground);
  const choose = () => {
    switch (reward.kind) {
      case 'mascot':
        setSetting('mascot', reward.key);
        break;
      case 'decor':
        setSetting('decor', reward.key);
        break;
      case 'track':
        setSetting('musicTrack', reward.key);
        void startBackground(MUSIC_TRACKS[reward.key]);
    }
  };
  useEffect(() => {
    Animated.sequence([
      Animated.delay(800),
      Animated.timing(pop, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.6)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  const {title, name, picture} = rewardLook(reward);
  return (
    <Animated.View
      style={[
        styles.rewardPop,
        {
          opacity: pop,
          transform: [
            {
              scale: pop.interpolate({
                inputRange: [0, 1],
                outputRange: [0.6, 1],
              }),
            },
          ],
        },
      ]}>
      <Pressable style={styles.reward} onPress={choose}>
        {picture}
        <View style={styles.rewardText}>
          <Text style={styles.rewardTitle}>{title}</Text>
          <Text style={styles.rewardName}>{name}</Text>
        </View>
        {chosen && (
          <View style={styles.rewardCheck}>
            <MaterialCommunityIcons name="check-bold" size={15} color="#fff" />
          </View>
        )}
      </Pressable>
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
  const claimReward = useRewardsStore((s) => s.claim);
  const [reward, setReward] = useState<Reward | null>(null);
  const maxQuestion = store.questions.length;
  const {gameId, gameType} = route.params;
  const game = gameConfig(gameType);

  const results = store.getResults();
  const isGood = results >= maxQuestion / 2;
  const isPerfect = results === maxQuestion;

  // Trois étoiles au score qui donne une récompense ; l'humeur de la mascotte suit les étoiles :
  // < 5 → 1★ (triste), 5–8 → 2★ (contente), ≥ 9 → 3★ (hyper contente)
  const stars = results >= SUCCESS_SCORE ? 3 : results >= 5 ? 2 : 1;
  const mood = stars === 3 ? 'happy' : stars === 2 ? 'content' : 'sad';

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

  // Avant le premier affichage : la récompense prend la place du message sans qu'il clignote.
  useLayoutEffect(() => {
    setReward(claimReward(gameId, gameType, results));
  }, []);

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
        {reward ? (
          <RewardCard reward={reward} />
        ) : (
          <Text style={styles.message}>{message}</Text>
        )}
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
  rewardPop: {
    marginTop: 18,
  },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: shade(NOL.star, 0.3),
    paddingVertical: 10,
    paddingHorizontal: 18,
    elevation: 6,
  },
  rewardCheck: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: NOL.mint,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 7,
  },
  rewardDecor: {
    width: 84,
    height: 49,
  },
  rewardText: {
    flexShrink: 1,
  },
  rewardTitle: {
    fontFamily: FONT.UI_HEAVY,
    fontSize: 14,
    color: NOL.inkSoft,
  },
  rewardName: {
    fontFamily: FONT.DISPLAY_BOLD,
    fontSize: 24,
    lineHeight: 28,
    color: NOL.ink,
  },
  replay: {
    marginTop: 30,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 300,
  },
});
