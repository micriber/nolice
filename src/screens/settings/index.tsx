import {MaterialCommunityIcons} from '@expo/vector-icons';
import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import React, {useMemo, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';

import UnlockPopup from './unlock-popup';
import DecorThumb from '../../components/DecorThumb';
import Equalizer from '../../components/Equalizer';
import {DECOR_LABELS} from '../../components/IceBg';
import Mascot, {MASCOTS} from '../../components/Mascot';
import MusicButton from '../../components/MusicButton';
import RoundBtn from '../../components/RoundBtn';
import Screen from '../../components/Screen';
import {MUSIC_TRACKS, unlockSound, useSoundStore} from '../../store/audio';
import {useRewardsStore} from '../../store/rewards';
import {
  DecorKey,
  MusicTrackKey,
  Settings,
  useSettingsStore,
} from '../../store/settings';
import {NOL, shade} from '../../utils/color';
import FONT from '../../utils/font';
import {Unlock, lockOf, unlockHint} from '../../utils/rewards';
import {useScale} from '../../utils/scale';
import {TRACK_CHOICES} from '../../utils/tracks';
import {NavigationProp} from '../types';

type Props = {
  navigation: NavigationProp;
};

const DECORS: DecorKey[] = ['nuages', 'bulles', 'banquise', 'automne'];

const LOCKED_GREY = '#9FB4C2';

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
  const tracks = useRewardsStore((s) => s.tracks);
  const owned = {mascots, decors, tracks};
  const musicOn = useSoundStore((s) => s.backgroundPlaying);
  const startBackground = useSoundStore((s) => s.startBackground);

  const setSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    settings.setSetting(key, value);
    void logEvent(getAnalytics(), 'settings_change', {key, value});
  };

  const chooseTrack = (key: MusicTrackKey) => {
    setSetting('musicTrack', key);
    void startBackground(MUSIC_TRACKS[key]);
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
                const label = DECOR_LABELS[key];
                const unlock = lockOf({kind: 'decor', key}, owned);
                return (
                  <Pressable
                    key={key}
                    onPress={() => {
                      if (!unlock) {
                        setSetting('decor', key);
                        return;
                      }
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
              {TRACK_CHOICES.map((tr) => {
                const {key} = tr;
                const sel = settings.musicTrack === key;
                const unlock = lockOf({kind: 'track', key}, owned);
                return (
                  <Pressable
                    key={key}
                    onPress={() => {
                      if (!unlock) {
                        chooseTrack(key);
                        return;
                      }
                      setLocked({
                        title: tr.label,
                        unlock,
                        picture: (
                          <MaterialCommunityIcons
                            name={tr.icon}
                            size={80 * scale}
                            color={tr.color}
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
          sound={unlockSound(locked.unlock)}
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
