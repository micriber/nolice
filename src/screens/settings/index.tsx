import {MaterialCommunityIcons} from '@expo/vector-icons';
import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import UnlockPopup from './unlock-popup';
import DecorThumb from '../../components/DecorThumb';
import {DECOR_LABELS} from '../../components/IceBg';
import Mascot, {MASCOTS} from '../../components/Mascot';
import MusicButton from '../../components/MusicButton';
import RoundBtn from '../../components/RoundBtn';
import Screen from '../../components/Screen';
import {MUSIC_TRACKS, useSoundStore} from '../../store/audio';
import {useRewardsStore} from '../../store/rewards';
import {
  DecorKey,
  MusicTrackKey,
  Settings,
  useSettingsStore,
} from '../../store/settings';
import {NOL, shade} from '../../utils/color';
import FONT from '../../utils/font';
import {
  UPCOMING_DECOR_UNLOCK,
  UPCOMING_TRACK_UNLOCKS,
  Unlock,
  lockOf,
  unlockHint,
} from '../../utils/rewards';
import {useScale} from '../../utils/scale';
import {NavigationProp} from '../types';

type Props = {
  navigation: NavigationProp;
};

// 'mystery' : une récompense dont le contenu reste à créer.
type DecorOption = DecorKey | 'mystery';

const DECORS: DecorOption[] = ['nuages', 'bulles', 'banquise', 'mystery'];

const LOCKED_GREY = '#9FB4C2';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

// Un pictogramme par musique : l'enfant la reconnaît sans lire son nom.
const TRACKS: {
  key?: MusicTrackKey;
  label: string;
  icon: IconName;
  color: string;
  unlock?: Unlock;
}[] = [
  {
    key: 'joyeuse',
    label: 'Joyeuse',
    icon: 'white-balance-sunny',
    color: NOL.amber,
  },
  {key: 'calme', label: 'Calme', icon: 'weather-night', color: NOL.violet},
  ...UPCOMING_TRACK_UNLOCKS.map((unlock) => ({
    label: 'Mystère',
    icon: 'help' as const,
    color: LOCKED_GREY,
    unlock,
  })),
];

const DESIGN_WIDTH = 412;
const DESIGN_HEIGHT = 1035;

type LockedInfo = {title: string; unlock: Unlock; picture: React.ReactNode};

function useScaledStyles() {
  const scale = useScale(DESIGN_HEIGHT);
  const styles = useMemo(() => makeStyles(scale), [scale]);
  return {scale, styles};
}

function SettingsCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const {styles} = useScaledStyles();
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function CheckBadge({small}: {small?: boolean}) {
  const {scale, styles} = useScaledStyles();
  const size = (small ? 22 : 26) * scale;
  return (
    <View
      style={[
        styles.badge,
        styles.checkBadge,
        {width: size, height: size, borderRadius: size / 2},
      ]}>
      <MaterialCommunityIcons
        name="check-bold"
        size={(small ? 12 : 15) * scale}
        color="#fff"
      />
    </View>
  );
}

const BEATS = [0, 1, 2, 3];

// Barres qui dansent sur la musique en cours : c'est celle-ci qu'on entend. À plat si la musique est coupée.
function Equalizer({playing, unit}: {playing: boolean; unit: number}) {
  const beats = useRef(BEATS.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    if (!playing) return;
    const loops = beats.map((beat, i) => {
      const half = {
        duration: 240 + i * 85,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      };
      return Animated.loop(
        Animated.sequence([
          Animated.timing(beat, {toValue: 1, ...half}),
          Animated.timing(beat, {toValue: 0, ...half}),
        ]),
      );
    });
    loops.forEach((loop) => {
      loop.start();
    });
    return () => {
      loops.forEach((loop) => {
        loop.stop();
      });
      beats.forEach((beat) => {
        beat.setValue(0);
      });
    };
  }, [playing]);
  return (
    <View style={{flexDirection: 'row', gap: 3 * unit}}>
      {beats.map((beat, i) => (
        <Animated.View
          key={i}
          style={{
            width: 4 * unit,
            height: 14 * unit,
            borderRadius: 2 * unit,
            backgroundColor: NOL.sky,
            transform: [
              {
                scaleY: beat.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.25, 1],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
}

// Cadenas et « i » posés sur une récompense verrouillée : la toucher ouvre l'explication.
function LockBadges({small}: {small?: boolean}) {
  const {scale, styles} = useScaledStyles();
  const size = (small ? 22 : 26) * scale;
  const round = {width: size, height: size, borderRadius: size / 2};
  return (
    <>
      <View style={[styles.badge, round, styles.lockBadge]}>
        <MaterialCommunityIcons
          name="lock"
          size={(small ? 12 : 14) * scale}
          color="#fff"
        />
      </View>
      <View style={[styles.badge, round, styles.infoBadge]}>
        <MaterialCommunityIcons
          name="information-variant"
          size={(small ? 15 : 18) * scale}
          color="#fff"
        />
      </View>
    </>
  );
}

export default function SettingsScreen({navigation}: Props) {
  const settings = useSettingsStore();
  const {scale, styles} = useScaledStyles();
  const [locked, setLocked] = useState<LockedInfo | null>(null);
  const mascots = useRewardsStore((s) => s.mascots);
  const decors = useRewardsStore((s) => s.decors);
  const owned = {mascots, decors};
  const musicOn = useSoundStore((s) => s.backgroundPlaying);
  const playBackground = useSoundStore((s) => s.playBackground);
  const toggleBackground = useSoundStore((s) => s.toggleBackground);

  const setSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    settings.setSetting(key, value);
    void logEvent(getAnalytics(), 'settings_change', {key, value});
  };

  // Choisir une musique, c'est vouloir l'entendre : elle démarre même si la musique était coupée.
  const chooseTrack = async (key: MusicTrackKey) => {
    setSetting('musicTrack', key);
    await playBackground(MUSIC_TRACKS[key]);
    if (!useSoundStore.getState().backgroundPlaying) toggleBackground();
  };

  return (
    <Screen scene={settings.decor}>
      <View style={styles.page}>
        {/* barre du haut */}
        <View style={styles.topBar}>
          <RoundBtn
            size={46 * scale}
            onPress={() => {
              navigation.goBack();
            }}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24 * scale}
              color={NOL.ink}
            />
          </RoundBtn>
          <Text style={styles.title}>Réglages</Text>
          <MusicButton size={46 * scale} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* MASCOTTE */}
          <SettingsCard title="Ta mascotte">
            <View style={styles.mascotGrid}>
              {MASCOTS.map((m) => {
                const sel = settings.mascot === m.key;
                const unlock = lockOf({kind: 'mascot', key: m.key}, owned);
                return (
                  <Pressable
                    key={m.key}
                    onPress={() => {
                      if (!unlock) {
                        setSetting('mascot', m.key);
                        return;
                      }
                      setLocked({
                        title: m.label,
                        unlock,
                        picture: (
                          <Mascot size={110 * scale} who={m.key} anim="none" />
                        ),
                      });
                    }}
                    style={styles.mascotCell}>
                    <View
                      style={[
                        styles.mascotTile,
                        sel && {
                          backgroundColor: shade(NOL.sky, 0.8),
                          borderColor: NOL.sky,
                          borderWidth: 3,
                        },
                      ]}>
                      <View style={unlock && styles.locked}>
                        <Mascot size={54 * scale} who={m.key} anim="none" />
                      </View>
                      {sel && <CheckBadge />}
                      {unlock && <LockBadges />}
                    </View>
                    <Text
                      style={[
                        styles.optionLabel,
                        sel && {color: NOL.sky},
                        unlock && styles.lockedLabel,
                      ]}>
                      {m.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </SettingsCard>

          {/* DÉCOR */}
          <SettingsCard title="Le décor">
            <View style={styles.decorRow}>
              {DECORS.map((key) => {
                const sel = settings.decor === key;
                const label = key === 'mystery' ? 'Mystère' : DECOR_LABELS[key];
                const unlock =
                  key === 'mystery'
                    ? UPCOMING_DECOR_UNLOCK
                    : lockOf({kind: 'decor', key}, owned);
                return (
                  <Pressable
                    key={key}
                    onPress={() => {
                      if (key !== 'mystery' && !unlock) {
                        setSetting('decor', key);
                        return;
                      }
                      if (!unlock) return;
                      setLocked({
                        title: label,
                        unlock,
                        picture: (
                          <View style={styles.popupDecor}>
                            <DecorThumb
                              scene={key}
                              unit={scale * 1.3}
                              radius={16 * scale}
                            />
                          </View>
                        ),
                      });
                    }}
                    style={styles.decorCell}>
                    <View
                      style={[
                        styles.decorFrame,
                        sel && {borderColor: NOL.sky, borderWidth: 3},
                      ]}>
                      <View style={[styles.decorFill, unlock && styles.locked]}>
                        <DecorThumb
                          scene={key}
                          unit={scale * 0.72}
                          radius={13 * scale}
                        />
                      </View>
                      {sel && <CheckBadge small />}
                      {unlock && <LockBadges small />}
                    </View>
                    <Text
                      style={[
                        styles.optionLabel,
                        sel && {color: NOL.sky},
                        unlock && styles.lockedLabel,
                      ]}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </SettingsCard>

          {/* MUSIQUE */}
          <SettingsCard title="La musique">
            <View style={styles.decorRow}>
              {TRACKS.map((tr, i) => {
                const sel = settings.musicTrack === tr.key;
                const {key, unlock} = tr;
                return (
                  <Pressable
                    key={i}
                    onPress={() => {
                      if (key) {
                        void chooseTrack(key);
                        return;
                      }
                      if (!unlock) return;
                      setLocked({
                        title: tr.label,
                        unlock,
                        picture: (
                          <MaterialCommunityIcons
                            name="music"
                            size={80 * scale}
                            color={NOL.sky}
                          />
                        ),
                      });
                    }}
                    style={styles.decorCell}>
                    <View
                      style={[
                        styles.trackFrame,
                        sel && {
                          backgroundColor: shade(NOL.sky, 0.8),
                          borderColor: NOL.sky,
                          borderWidth: 3,
                        },
                      ]}>
                      <View style={[styles.trackFill, unlock && styles.locked]}>
                        <MaterialCommunityIcons
                          name={tr.icon}
                          size={32 * scale}
                          color={tr.color}
                        />
                        {sel && <Equalizer playing={musicOn} unit={scale} />}
                      </View>
                      {sel && <CheckBadge small />}
                      {unlock && <LockBadges small />}
                    </View>
                    <Text
                      style={[
                        styles.optionLabel,
                        sel && {color: NOL.sky},
                        unlock && styles.lockedLabel,
                      ]}>
                      {tr.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </SettingsCard>
        </ScrollView>
      </View>
      {locked && (
        <UnlockPopup
          title={locked.title}
          hint={unlockHint(locked.unlock)}
          picture={locked.picture}
          onClose={() => {
            setLocked(null);
          }}
        />
      )}
    </Screen>
  );
}

function makeStyles(scale: number) {
  return StyleSheet.create({
    page: {
      flex: 1,
      width: '100%',
      maxWidth: DESIGN_WIDTH * scale,
      alignSelf: 'center',
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12 * scale,
      paddingHorizontal: 18 * scale,
      paddingTop: 8 * scale,
    },
    title: {
      flex: 1,
      textAlign: 'center',
      fontFamily: FONT.DISPLAY_BOLD,
      fontSize: 26 * scale,
      color: NOL.ink,
    },
    scroll: {
      flex: 1,
      marginTop: 16 * scale,
    },
    scrollContent: {
      paddingHorizontal: 18 * scale,
      paddingBottom: 22 * scale,
      gap: 16 * scale,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 26 * scale,
      paddingHorizontal: 18 * scale,
      paddingTop: 16 * scale,
      paddingBottom: 18 * scale,
      elevation: 5,
    },
    cardTitle: {
      fontFamily: FONT.DISPLAY,
      fontSize: 19 * scale,
      color: NOL.ink,
      marginBottom: 14 * scale,
    },
    mascotGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12 * scale,
    },
    mascotCell: {
      width: '30%',
      flexGrow: 1,
      alignItems: 'center',
      gap: 5 * scale,
    },
    mascotTile: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: 20 * scale,
      backgroundColor: '#F4FAFD',
      borderWidth: 2,
      borderColor: '#E4EFF5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    badge: {
      position: 'absolute',
      top: -7 * scale,
      borderWidth: 3,
      borderColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 3,
    },
    optionLabel: {
      fontFamily: FONT.UI_HEAVY,
      fontSize: 12.5 * scale,
      color: NOL.inkSoft,
    },
    checkBadge: {
      right: -7 * scale,
      backgroundColor: NOL.mint,
    },
    lockBadge: {
      right: -7 * scale,
      backgroundColor: LOCKED_GREY,
    },
    infoBadge: {
      left: -7 * scale,
      backgroundColor: NOL.sky,
    },
    locked: {
      opacity: 0.35,
    },
    lockedLabel: {
      color: LOCKED_GREY,
    },
    decorRow: {
      flexDirection: 'row',
      gap: 12 * scale,
    },
    decorCell: {
      flex: 1,
      alignItems: 'center',
      gap: 6 * scale,
    },
    decorFrame: {
      width: '100%',
      height: 56 * scale,
      borderRadius: 16 * scale,
      borderWidth: 2,
      borderColor: '#E4EFF5',
      overflow: 'visible',
    },
    decorFill: {
      flex: 1,
    },
    popupDecor: {
      width: 156 * scale,
      height: 91 * scale,
    },
    trackFrame: {
      width: '100%',
      height: 70 * scale,
      borderRadius: 16 * scale,
      borderWidth: 2,
      borderColor: '#E4EFF5',
      backgroundColor: '#F4FAFD',
    },
    trackFill: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4 * scale,
    },
  });
}
