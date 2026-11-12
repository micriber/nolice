import {MaterialCommunityIcons} from '@expo/vector-icons';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Defs, LinearGradient, Path, Rect, Stop} from 'react-native-svg';

import FillSvg from './FillSvg';
import {DecorKey} from '../store/settings';
import {NOL, shade} from '../utils/color';

type Props = {
  scene: DecorKey;
  unit: number;
  radius: number;
};

// Vignette miniature d'un décor, qui remplit son conteneur. `unit` : taille d'un dp de sa maquette (120 × 70).
export default function DecorThumb({scene, unit, radius}: Props) {
  const scale = unit;
  return (
    <View style={[styles.thumb, {borderRadius: radius}]}>
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
        {scene === 'etoiles' && (
          <>
            <Rect width="120" height="70" fill={NOL.violet} opacity={0.14} />
            <Path
              d="M0 42 Q30 28 60 40 T120 36 L120 70 L0 70 Z"
              fill={shade(NOL.violet, 0.5)}
            />
          </>
        )}
        {scene === 'ocean' && (
          <>
            <Rect width="120" height="70" fill={NOL.sky} opacity={0.14} />
            <Path
              d="M0 42 Q30 28 60 40 T120 36 L120 70 L0 70 Z"
              fill={shade(NOL.amber, 0.55)}
            />
          </>
        )}
        {scene === 'automne' && (
          <Path
            d="M0 42 Q30 28 60 40 T120 36 L120 70 L0 70 Z"
            fill={shade(NOL.amberDeep, 0.35)}
          />
        )}
      </FillSvg>
      {scene === 'banquise' && (
        <>
          <View
            style={[
              styles.dot,
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
              styles.dot,
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
      {scene === 'automne' &&
        (
          [
            [14, 8, 16, NOL.coral, 20],
            [50, 18, 20, NOL.star, 140],
            [84, 6, 15, NOL.coralDeep, 250],
          ] as [number, number, number, string, number][]
        ).map((leaf, i) => (
          <MaterialCommunityIcons
            key={i}
            name="leaf"
            size={leaf[2] * scale}
            color={leaf[3]}
            style={{
              position: 'absolute',
              left: leaf[0] * scale,
              top: leaf[1] * scale,
              transform: [{rotate: `${leaf[4]}deg`}],
            }}
          />
        ))}
      {scene === 'etoiles' &&
        (
          [
            [12, 8, 14],
            [44, 18, 10],
            [70, 6, 12],
            [96, 20, 16],
          ] as [number, number, number][]
        ).map((star, i) => (
          <MaterialCommunityIcons
            key={i}
            name="star-four-points"
            size={star[2] * scale}
            color="#fff"
            style={{
              position: 'absolute',
              left: star[0] * scale,
              top: star[1] * scale,
            }}
          />
        ))}
      {scene === 'ocean' &&
        (
          [
            [12, 8, 18, NOL.coral],
            [52, 18, 14, NOL.violet],
            [84, 6, 20, NOL.teal],
          ] as [number, number, number, string][]
        ).map((fish, i) => (
          <MaterialCommunityIcons
            key={i}
            name="fish"
            size={fish[2] * scale}
            color={fish[3]}
            style={{
              position: 'absolute',
              left: fish[0] * scale,
              top: fish[1] * scale,
              opacity: 0.7,
            }}
          />
        ))}
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

const styles = StyleSheet.create({
  thumb: {
    flex: 1,
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    borderRadius: 4,
    backgroundColor: '#fff',
    opacity: 0.8,
  },
});
