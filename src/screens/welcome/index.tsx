import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {BackHandler, Pressable, StyleSheet, Text, View} from 'react-native';

import BigButton from '../../components/BigButton';
import DecorThumb from '../../components/DecorThumb';
import Equalizer from '../../components/Equalizer';
import {DECOR_LABELS} from '../../components/IceBg';
import Mascot, {MASCOTS} from '../../components/Mascot';
import Progress from '../../components/Progress';
import RoundBtn from '../../components/RoundBtn';
import Screen from '../../components/Screen';
import {MUSIC_TRACKS, useSoundStore} from '../../store/audio';
import {DecorKey, useSettingsStore} from '../../store/settings';
import {NOL, shade} from '../../utils/color';
import FONT from '../../utils/font';
import {
  DECOR_UNLOCKS,
  MASCOT_UNLOCKS,
  TRACK_UNLOCKS,
} from '../../utils/rewards';
import {useScale} from '../../utils/scale';
import {TRACK_CHOICES} from '../../utils/tracks';
import {NavigationProp} from '../types';

type Props = {
  navigation: NavigationProp;
};

const TITLES = [
  'Choisis ta mascotte',
  'Choisis ton décor',
  'Choisis ta musique',
];

// Le parcours ne propose que ce qui est disponible sans rien avoir gagné.
const BASE_MASCOTS = MASCOTS.filter((mascot) => !MASCOT_UNLOCKS[mascot.key]);
const BASE_DECORS = (Object.keys(DECOR_LABELS) as DecorKey[]).filter(
  (decor) => !DECOR_UNLOCKS[decor],
);
const BASE_TRACKS = TRACK_CHOICES.filter((track) => !TRACK_UNLOCKS[track.key]);

function Choice({
  selected,
  label,
  scale,
  onPress,
  children,
}: {
  selected: boolean;
  label: string;
  scale: number;
  onPress: () => void;
  children: React.ReactNode;
}) {
  const badge = 30 * scale;
  return (
    <Pressable onPress={onPress} style={[styles.choice, {gap: 8 * scale}]}>
      <View
        style={[
          styles.tile,
          {height: 128 * scale, borderRadius: 24 * scale, gap: 6 * scale},
          selected && styles.tileSelected,
        ]}>
        {children}
        {selected && (
          <View
            style={[
              styles.check,
              {
                top: -8 * scale,
                right: -8 * scale,
                width: badge,
                height: badge,
                borderRadius: badge / 2,
              },
            ]}>
            <MaterialCommunityIcons
              name="check-bold"
              size={17 * scale}
              color="#fff"
            />
          </View>
        )}
      </View>
      <Text
        style={[
          styles.label,
          {fontSize: 16 * scale},
          selected && {color: NOL.sky},
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

// Premier lancement : l'enfant choisit sa mascotte, son décor et sa musique, une étape après l'autre.
export default function WelcomeScreen({navigation}: Props) {
  const scale = useScale();
  const settings = useSettingsStore();
  const musicOn = useSoundStore((s) => s.backgroundPlaying);
  const startBackground = useSoundStore((s) => s.startBackground);
  const [step, setStep] = useState(0);
  const last = step === TITLES.length - 1;

  useFocusEffect(
    useCallback(() => {
      const back = BackHandler.addEventListener('hardwareBackPress', () => {
        if (step === 0) return false;
        setStep(step - 1);
        return true;
      });
      return () => {
        back.remove();
      };
    }, [step]),
  );

  const next = () => {
    if (!last) {
      setStep(step + 1);
      return;
    }
    settings.setSetting('welcomed', true);
    navigation.replace('Home');
  };

  return (
    <Screen scene={settings.decor}>
      <View
        style={[
          styles.page,
          {
            maxWidth: 412 * scale,
            paddingHorizontal: 20 * scale,
            paddingTop: 10 * scale,
            paddingBottom: 26 * scale,
          },
        ]}>
        <View style={[styles.top, {height: 46 * scale}]}>
          <View style={{width: 46 * scale}}>
            {step > 0 && (
              <RoundBtn
                size={46 * scale}
                onPress={() => {
                  setStep(step - 1);
                }}>
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={24 * scale}
                  color={NOL.ink}
                />
              </RoundBtn>
            )}
          </View>
          <Progress
            total={TITLES.length}
            results={TITLES.map((_, i) => (i < step ? true : undefined))}
            current={step}
            dotSize={11 * scale}
          />
          <View style={{width: 46 * scale}} />
        </View>

        <View style={[styles.body, {gap: 22 * scale}]}>
          <Mascot size={140 * scale} anim="bob" />
          <Text
            style={[styles.title, {fontSize: 28 * scale}]}
            numberOfLines={1}
            adjustsFontSizeToFit>
            {TITLES[step]}
          </Text>
          <View style={[styles.choices, {gap: 12 * scale}]}>
            {step === 0 &&
              BASE_MASCOTS.map((mascot) => (
                <Choice
                  key={mascot.key}
                  label={mascot.label}
                  selected={settings.mascot === mascot.key}
                  scale={scale}
                  onPress={() => {
                    settings.setSetting('mascot', mascot.key);
                  }}>
                  <Mascot size={84 * scale} who={mascot.key} anim="none" />
                </Choice>
              ))}
            {step === 1 &&
              BASE_DECORS.map((decor) => (
                <Choice
                  key={decor}
                  label={DECOR_LABELS[decor]}
                  selected={settings.decor === decor}
                  scale={scale}
                  onPress={() => {
                    settings.setSetting('decor', decor);
                  }}>
                  <View style={{width: 132 * scale, height: 77 * scale}}>
                    <DecorThumb
                      scene={decor}
                      unit={scale * 1.1}
                      radius={14 * scale}
                    />
                  </View>
                </Choice>
              ))}
            {step === 2 &&
              BASE_TRACKS.map((track) => {
                const selected = settings.musicTrack === track.key;
                return (
                  <Choice
                    key={track.key}
                    label={track.label}
                    selected={selected}
                    scale={scale}
                    onPress={() => {
                      settings.setSetting('musicTrack', track.key);
                      void startBackground(MUSIC_TRACKS[track.key]);
                    }}>
                    <MaterialCommunityIcons
                      name={track.icon}
                      size={64 * scale}
                      color={track.color}
                    />
                    {selected && (
                      <Equalizer playing={musicOn} unit={scale * 1.2} />
                    )}
                  </Choice>
                );
              })}
          </View>
        </View>

        <BigButton
          label={last ? 'C’est parti !' : 'Suivant'}
          color={last ? NOL.mint : NOL.sky}
          onPress={next}
          scale={scale}
          icon={
            <MaterialCommunityIcons
              name={last ? 'check-bold' : 'arrow-right'}
              size={26 * scale}
              color="#fff"
            />
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONT.DISPLAY_BOLD,
    color: NOL.ink,
    textAlign: 'center',
  },
  choices: {
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  choice: {
    flex: 1,
    alignItems: 'center',
  },
  tile: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 4,
  },
  tileSelected: {
    backgroundColor: shade(NOL.sky, 0.8),
    borderColor: NOL.sky,
  },
  check: {
    position: 'absolute',
    backgroundColor: NOL.mint,
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  label: {
    fontFamily: FONT.UI_HEAVY,
    color: NOL.ink,
  },
});
