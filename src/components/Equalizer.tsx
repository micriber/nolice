import React, {useEffect, useRef} from 'react';
import {Animated, Easing, View} from 'react-native';

import {NOL} from '../utils/color';

type Props = {
  playing: boolean;
  unit: number;
};

const BEATS = [0, 1, 2, 3];

// Barres qui dansent sur la musique en cours : c'est celle-ci qu'on entend. À plat si la musique est coupée.
export default function Equalizer({playing, unit}: Props) {
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
