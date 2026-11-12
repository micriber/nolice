import {MaterialCommunityIcons} from '@expo/vector-icons';
import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';

import FillSvg from '../../components/FillSvg';
import {
  AnimalGlyph,
  Letters,
  Numerals,
  PaletteGlyph,
  SequenceGlyph,
  ShapeCluster,
} from '../../components/GameGlyphs';
import Mascot from '../../components/Mascot';
import MusicButton from '../../components/MusicButton';
import RoundBtn from '../../components/RoundBtn';
import Screen from '../../components/Screen';
import {useSettingsStore} from '../../store/settings';
import {GAMES, GameConfig, NOL, shade} from '../../utils/color';
import FONT from '../../utils/font';
import {useScale} from '../../utils/scale';
import {QUESTION_CONFIGS} from '../game/question-config';
import {NavigationProp} from '../types';

type Props = {
  navigation: NavigationProp;
};

function CardGlyph({game, size}: {game: GameConfig; size: number}) {
  switch (game.key) {
    case 'number':
      return <Numerals size={size} />;
    case 'animal':
      return <AnimalGlyph size={size} />;
    case 'color':
      return <PaletteGlyph size={size} />;
    case 'letter':
      return <Letters size={size} />;
    case 'sequence':
      return <SequenceGlyph size={size} />;
    default:
      return <ShapeCluster size={size} />;
  }
}

const CARD_EDGE = 8;
const CARD_PRESSED_EDGE = 2;

// Carte de jeu : gros pictogramme sur pastille blanche (lisible sans savoir
// lire), couleur propre au jeu, bouton « 3D » qui s'enfonce.
function GameCard({
  game,
  delay,
  onPress,
}: {
  game: GameConfig;
  delay: number;
  onPress: () => void;
}) {
  const [down, setDown] = useState(false);
  const pop = useRef(new Animated.Value(0)).current;
  const scale = useScale();

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(pop, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [
          {
            scale: pop.interpolate({
              inputRange: [0, 1],
              outputRange: [0.78, 1],
            }),
          },
          {
            translateY: pop.interpolate({
              inputRange: [0, 1],
              outputRange: [16, 0],
            }),
          },
        ],
      }}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          setDown(true);
        }}
        onPressOut={() => {
          setDown(false);
        }}
        style={[
          styles.cardEdge,
          {
            borderRadius: 28 * scale,
            backgroundColor: game.deep,
            paddingBottom: down ? CARD_PRESSED_EDGE : CARD_EDGE,
            marginTop: down ? CARD_EDGE - CARD_PRESSED_EDGE : 0,
          },
        ]}>
        <View
          style={[
            styles.cardFace,
            {
              borderRadius: 28 * scale,
              gap: 12 * scale,
              padding: 14 * scale,
              backgroundColor: game.color,
            },
          ]}>
          <FillSvg>
            <Defs>
              <LinearGradient
                id={`card-${game.key}`}
                x1="0"
                y1="0"
                x2="0.4"
                y2="1">
                <Stop offset="0" stopColor={shade(game.color, 0.16)} />
                <Stop offset="1" stopColor={game.color} />
              </LinearGradient>
            </Defs>
            <Rect width="100" height="100" fill={`url(#card-${game.key})`} />
          </FillSvg>
          <View
            style={[
              styles.plate,
              {
                width: 108 * scale,
                height: 108 * scale,
                borderRadius: 54 * scale,
              },
            ]}>
            <CardGlyph game={game} size={78 * scale} />
          </View>
          <Text
            style={[styles.cardLabel, {fontSize: 20 * scale}]}
            numberOfLines={1}
            adjustsFontSizeToFit>
            {game.label}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function Home({navigation}: Props) {
  const decor = useSettingsStore((s) => s.decor);
  const scale = useScale();
  const leaving = useRef(false);

  useFocusEffect(
    useCallback(() => {
      leaving.current = false;
    }, []),
  );

  // Un seul départ par visite : deux doigts sur deux boutons empileraient deux écrans.
  const leave = (go: () => void) => {
    if (leaving.current) return;
    leaving.current = true;
    go();
  };

  const openSettings = () => {
    leave(() => {
      navigation.navigate('Settings');
    });
  };

  const handleGame = (game: GameConfig) => {
    if (game.key === 'number') {
      void logEvent(getAnalytics(), 'NumberGame');
      navigation.navigate('NumberGame');
      return;
    }
    if (game.key === 'sequence') {
      void logEvent(getAnalytics(), 'SequenceGame');
      navigation.navigate('SequenceGame');
      return;
    }
    const events: {[key: string]: string} = {
      color: 'ColorGame',
      animal: 'AnimalGame',
      shape: 'ShapeGame',
      letter: 'LetterGame',
    };
    void logEvent(getAnalytics(), events[game.key]);
    navigation.navigate('FindGame', {
      questionConfig: QUESTION_CONFIGS[game.key],
      gameType: game.key,
    });
  };

  return (
    <Screen scene={decor}>
      {/* en-tête : mascotte + marque + réglages + musique */}
      <View
        style={[
          styles.header,
          {
            gap: 10 * scale,
            paddingHorizontal: 20 * scale,
            paddingTop: 10 * scale,
          },
        ]}>
        {/* la mascotte mène aux réglages, comme le pinceau : un enfant touche ce qu'il veut changer */}
        <Pressable onPress={openSettings} hitSlop={8 * scale}>
          <Mascot size={56 * scale} anim="bob" />
        </Pressable>
        <View style={styles.brand}>
          <Text
            style={[
              styles.brandName,
              {fontSize: 30 * scale, lineHeight: 34 * scale},
            ]}>
            Nolice
          </Text>
          <View
            style={[styles.tagline, {gap: 5 * scale, marginTop: 2 * scale}]}>
            <MaterialCommunityIcons
              name="star"
              size={13 * scale}
              color={NOL.star}
            />
            <Text style={[styles.taglineText, {fontSize: 12.5 * scale}]}>
              Apprendre en s'amusant
            </Text>
          </View>
        </View>
        <RoundBtn size={52 * scale} onPress={openSettings}>
          <MaterialCommunityIcons
            name="brush"
            size={24 * scale}
            color={NOL.sky}
          />
        </RoundBtn>
        <MusicButton size={52 * scale} />
      </View>
      <Text
        style={[styles.title, {fontSize: 27 * scale, marginTop: 18 * scale}]}>
        Choisis ton jeu
      </Text>
      {/* grille 2 colonnes (s'adapte si on ajoute des jeux : 4 → 2×2, 6 → 3×2) */}
      <View
        style={[
          styles.grid,
          {
            paddingHorizontal: 20 * scale,
            paddingTop: 14 * scale,
            paddingBottom: 26 * scale,
            gap: 14 * scale,
          },
        ]}>
        {Array.from({length: Math.ceil(GAMES.length / 2)}).map((_, row) => (
          <View key={row} style={[styles.gridRow, {gap: 14 * scale}]}>
            {GAMES.slice(row * 2, row * 2 + 2).map((game, col) => (
              <GameCard
                key={game.key}
                game={game}
                delay={(row * 2 + col) * 60}
                onPress={() => {
                  leave(() => {
                    handleGame(game);
                  });
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brand: {
    flex: 1,
    minWidth: 0,
  },
  brandName: {
    fontFamily: FONT.DISPLAY_BOLD,
    color: NOL.ink,
  },
  tagline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taglineText: {
    fontFamily: FONT.UI,
    color: NOL.inkSoft,
  },
  title: {
    fontFamily: FONT.DISPLAY_BOLD,
    color: NOL.ink,
    textAlign: 'center',
  },
  grid: {
    flex: 1,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
  },
  cardEdge: {
    flex: 1,
    elevation: 6,
  },
  cardFace: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plate: {
    backgroundColor: 'rgba(255,255,255,.95)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  cardLabel: {
    fontFamily: FONT.DISPLAY,
    color: '#fff',
  },
});
