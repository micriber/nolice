import {MaterialCommunityIcons} from '@expo/vector-icons';
import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import React, {useMemo} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Defs, LinearGradient, Path, Rect, Stop} from 'react-native-svg';

import FillSvg from '../../components/FillSvg';
import Mascot, {MASCOTS} from '../../components/Mascot';
import MusicButton from '../../components/MusicButton';
import RoundBtn from '../../components/RoundBtn';
import Screen from '../../components/Screen';
import {
  DecorKey,
  MusicTrackKey,
  Settings,
  useSettingsStore,
} from '../../store/settings';
import {NOL, shade} from '../../utils/color';
import FONT from '../../utils/font';
import {useScale} from '../../utils/scale';
import {NavigationProp} from '../types';

type Props = {
  navigation: NavigationProp;
};

const DECORS: {key: DecorKey; label: string}[] = [
  {key: 'nuages', label: 'Nuages'},
  {key: 'bulles', label: 'Bulles'},
  {key: 'banquise', label: 'Banquise'},
];

const TRACKS: {key: MusicTrackKey; label: string}[] = [
  {key: 'joyeuse', label: 'Joyeuse'},
  {key: 'calme', label: 'Calme'},
];

const DESIGN_WIDTH = 412;
const DESIGN_HEIGHT = 860;

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

// Vignette miniature d'un décor.
function DecorThumb({scene}: {scene: DecorKey}) {
  const {scale, styles} = useScaledStyles();
  return (
    <View style={styles.thumb}>
      <FillSvg viewBox="0 0 120 70">
        <Defs>
          <LinearGradient id={`thumb-${scene}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={shade(NOL.sky, 0.78)} />
            <Stop offset="1" stopColor={shade(NOL.sky, 0.64)} />
          </LinearGradient>
        </Defs>
        <Rect width="120" height="70" fill={`url(#thumb-${scene})`} />
        {scene === 'banquise' && (
          <Path d="M0 42 Q30 28 60 40 T120 36 L120 70 L0 70 Z" fill="#FBFEFF" />
        )}
      </FillSvg>
      {scene === 'banquise' && (
        <>
          <View
            style={[
              styles.thumbDot,
              {
                top: 12 * scale,
                left: 14 * scale,
                width: 4 * scale,
                height: 4 * scale,
              },
            ]}
          />
          <View
            style={[
              styles.thumbDot,
              {
                top: 24 * scale,
                left: 40 * scale,
                width: 3 * scale,
                height: 3 * scale,
              },
            ]}
          />
        </>
      )}
      {scene === 'bulles' &&
        (
          [
            [12, 14, 14, NOL.coral],
            [58, 10, 18, NOL.amber],
            [30, 34, 12, NOL.teal],
            [72, 36, 14, NOL.violet],
          ] as [number, number, number, string][]
        ).map((b, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: b[0] * scale,
              top: b[1] * scale,
              width: b[2] * scale,
              height: b[2] * scale,
              borderRadius: (b[2] * scale) / 2,
              backgroundColor: b[3],
              opacity: 0.35,
            }}
          />
        ))}
      {scene === 'nuages' && (
        <>
          <View
            style={{
              position: 'absolute',
              top: 8 * scale,
              left: 10 * scale,
              width: 14 * scale,
              height: 14 * scale,
              borderRadius: 7 * scale,
              backgroundColor: shade(NOL.star, 0.35),
            }}
          />
          {(
            [
              [20, 30],
              [52, 22],
              [40, 46],
            ] as [number, number][]
          ).map((c, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                left: c[0] * scale,
                top: c[1] * scale,
                width: 26 * scale,
                height: 10 * scale,
                borderRadius: 8 * scale,
                backgroundColor: '#fff',
                opacity: 0.92,
              }}
            />
          ))}
        </>
      )}
    </View>
  );
}

export default function SettingsScreen({navigation}: Props) {
  const settings = useSettingsStore();
  const {scale, styles} = useScaledStyles();

  const setSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    settings.setSetting(key, value);
    void logEvent(getAnalytics(), 'settings_change', {key, value});
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
                return (
                  <Pressable
                    key={m.key}
                    onPress={() => {
                      setSetting('mascot', m.key);
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
                      <Mascot size={54 * scale} who={m.key} anim="none" />
                      {sel && <CheckBadge />}
                    </View>
                    <Text style={[styles.optionLabel, sel && {color: NOL.sky}]}>
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
              {DECORS.map((d) => {
                const sel = settings.decor === d.key;
                return (
                  <Pressable
                    key={d.key}
                    onPress={() => {
                      setSetting('decor', d.key);
                    }}
                    style={styles.decorCell}>
                    <View
                      style={[
                        styles.decorFrame,
                        sel && {borderColor: NOL.sky, borderWidth: 3},
                      ]}>
                      <DecorThumb scene={d.key} />
                      {sel && <CheckBadge small />}
                    </View>
                    <Text style={[styles.optionLabel, sel && {color: NOL.sky}]}>
                      {d.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </SettingsCard>

          {/* MUSIQUE */}
          <SettingsCard title="La musique">
            <View style={styles.trackRow}>
              {TRACKS.map((tr) => {
                const sel = settings.musicTrack === tr.key;
                return (
                  <Pressable
                    key={tr.key}
                    onPress={() => {
                      setSetting('musicTrack', tr.key);
                    }}
                    style={[
                      styles.trackBtn,
                      sel
                        ? {backgroundColor: NOL.sky}
                        : {
                            backgroundColor: '#F4FAFD',
                            borderWidth: 2,
                            borderColor: '#E4EFF5',
                          },
                    ]}>
                    <MaterialCommunityIcons
                      name="music"
                      size={20 * scale}
                      color={sel ? '#fff' : NOL.inkSoft}
                    />
                    <Text
                      style={[
                        styles.trackLabel,
                        {color: sel ? '#fff' : NOL.inkSoft},
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
    checkBadge: {
      position: 'absolute',
      top: -7 * scale,
      right: -7 * scale,
      backgroundColor: NOL.mint,
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
      height: 70 * scale,
      borderRadius: 16 * scale,
      borderWidth: 2,
      borderColor: '#E4EFF5',
      overflow: 'visible',
    },
    thumb: {
      flex: 1,
      borderRadius: 13 * scale,
      overflow: 'hidden',
    },
    thumbDot: {
      position: 'absolute',
      borderRadius: 4 * scale,
      backgroundColor: '#fff',
      opacity: 0.8,
    },
    trackRow: {
      flexDirection: 'row',
      gap: 10 * scale,
    },
    trackBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8 * scale,
      borderRadius: 18 * scale,
      paddingVertical: 14 * scale,
    },
    trackLabel: {
      fontFamily: FONT.DISPLAY,
      fontSize: 17 * scale,
    },
  });
}
