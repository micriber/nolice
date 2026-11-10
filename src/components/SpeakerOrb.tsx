import {MaterialCommunityIcons} from '@expo/vector-icons';
import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet} from 'react-native';

import RoundBtn from './RoundBtn';
import {useSoundStore} from '../store/audio';

type Props = {
  color: string;
  disabled: boolean;
  // change de valeur à chaque nouvelle question pour relancer l'onde
  wave: number;
  size?: number;
};

// Bouton « répéter » : le bonhomme avec des ondes sonores (account-voice),
// dans une pastille blanche. Une onde circulaire part à chaque lecture.
export default function SpeakerOrb({color, wave, disabled, size = 58}: Props) {
  const audioLoading = useSoundStore((s) => s.audioLoading);
  const replay = useSoundStore((s) => s.replay);
  const replayDisabled = disabled || audioLoading;
  const ring = useRef(new Animated.Value(0)).current;

  const playRing = () => {
    ring.setValue(0);
    Animated.timing(ring, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    playRing();
  }, [wave]);

  const onPress = async () => {
    if (replayDisabled) return;
    playRing();
    const playback = replay();
    void logEvent(getAnalytics(), 'instruction');
    await playback;
  };

  return (
    <RoundBtn
      size={size}
      disabled={replayDisabled}
      accessibilityLabel="Répéter la question"
      onPress={() => {
        void onPress();
      }}>
      <Animated.View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: color,
            opacity: ring.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 0],
            }),
            transform: [
              {
                scale: ring.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1.5],
                }),
              },
            ],
          },
        ]}
      />
      <MaterialCommunityIcons
        name="account-voice"
        size={size * (30 / 58)}
        color={color}
        style={{opacity: replayDisabled ? 0.35 : 1}}
      />
    </RoundBtn>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    borderWidth: 3,
  },
});
