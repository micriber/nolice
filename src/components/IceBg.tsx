import {MaterialCommunityIcons} from '@expo/vector-icons';
import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import FillSvg from './FillSvg';
import {DecorKey} from '../store/settings';
import {NOL, shade} from '../utils/color';

type Props = {
  tint?: string;
  scene?: DecorKey;
};

export const DECOR_LABELS: Record<DecorKey, string> = {
  nuages: 'Nuages',
  bulles: 'Bulles',
  banquise: 'Banquise',
};

// Répartition fixe et régulière : le même décor à chaque rendu, sans paquet ni couloir vide.
const spread = (i: number) => ({
  across: ((i * 0.7549) % 1) * 100,
  phase: 0.02 + ((i * 0.5698) % 1) * 0.96,
});

const SNOW = Array.from({length: 20}, (_, i) => {
  const star = i % 4 === 0;
  return {
    ...spread(i),
    size: star ? 20 + (i % 3) * 6 : 6 + (i % 4) * 3,
    opacity: star ? 0.8 : 0.7 + (i % 3) * 0.15,
    duration: (star ? 22000 : 15000) + (i % 6) * 2100,
    sway: 6 + (i % 4) * 3,
    star,
  };
});

const BUBBLE_COLORS = [NOL.coral, NOL.amber, NOL.teal, NOL.violet, NOL.mint];

const BUBBLES = Array.from({length: 20}, (_, i) => ({
  ...spread(i),
  size: 14 + (i % 4) * 12,
  color: BUBBLE_COLORS[i % BUBBLE_COLORS.length],
  duration: 15000 + (i % 6) * 2100,
  sway: 6 + (i % 4) * 3,
}));

const CLOUD_WIDTH = 96;

// Un couloir par nuage, du haut au bas de l'écran : deux nuages ne se croisent jamais.
const CLOUDS = Array.from({length: 12}, (_, i) => ({
  top: ((i + 0.3) / 12) * 100,
  phase: spread(i).phase,
  scale: 0.7 + (i % 4) * 0.25,
  opacity: 0.85 + (i % 3) * 0.05,
  duration: 45000 + (i % 5) * 7000,
}));

// Élément qui traverse l'écran en boucle, de `from` à `to` sur l'axe donné, en se balançant sur l'autre.
// `phase` le place déjà en route au premier rendu.
function Drift({
  axis,
  from,
  to,
  phase,
  duration,
  sway,
  spin,
  style,
  children,
}: {
  axis: 'x' | 'y';
  from: number;
  to: number;
  phase: number;
  duration: number;
  sway: number;
  spin?: boolean;
  style: object;
  children: React.ReactNode;
}) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(v, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => {
      anim.stop();
    };
  }, []);
  const wrap = 1 - phase;
  const here = from + phase * (to - from);
  const travel = v.interpolate({
    inputRange: [0, wrap, wrap + 0.0001, 1],
    outputRange: [here, to, from, here],
  });
  const swing = v.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, sway, 0, -sway, 0],
  });
  // Un flocon a six branches : un tiers de tour le ramène à l'identique, la boucle ne saute pas.
  const turn = v.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', spin ? '120deg' : '0deg'],
  });
  return (
    <Animated.View
      style={[
        {position: 'absolute', left: 0, top: 0},
        style,
        {
          transform:
            axis === 'y'
              ? [{translateY: travel}, {translateX: swing}, {rotate: turn}]
              : [{translateX: travel}, {translateY: swing}, {rotate: turn}],
        },
      ]}>
      {children}
    </Animated.View>
  );
}

// Sol du décor : deux collines, celle du fond en transparence.
function Hills({color}: {color: string}) {
  return (
    <FillSvg viewBox="0 0 412 260" style={styles.hills}>
      <Path
        d="M0 120 Q110 60 230 110 T412 90 L412 260 L0 260 Z"
        fill={color}
        opacity={0.55}
      />
      <Path
        d="M0 170 Q140 110 270 160 T412 150 L412 260 L0 260 Z"
        fill={color}
      />
    </FillSvg>
  );
}

function Cloud({opacity}: {opacity: number}) {
  return (
    <Svg width={CLOUD_WIDTH} height={38} viewBox="0 0 96 38">
      <Path
        d="M14 35 C-3 35 -3 15 14 15 H25 C23 5 31 0 43 2 H61 C73 2 78 10 74 16 H81 C100 16 100 35 81 35 Z"
        fill="#fff"
        opacity={opacity}
      />
    </Svg>
  );
}

export default function IceBg({tint = NOL.sky, scene = 'nuages'}: Props) {
  const {width, height} = useWindowDimensions();
  return (
    <View
      style={[StyleSheet.absoluteFill, {backgroundColor: shade(tint, 0.68)}]}
      pointerEvents="none">
      {/* dégradé de fond + halo de soleil */}
      <FillSvg>
        <Defs>
          <LinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={shade(tint, 0.78)} />
            <Stop offset="0.38" stopColor={shade(tint, 0.62)} />
            <Stop offset="1" stopColor={shade(tint, 0.72)} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100" height="100" fill="url(#bg)" />
      </FillSvg>
      <Svg
        width={280}
        height={280}
        style={{position: 'absolute', top: -90, right: -70}}>
        <Circle cx={140} cy={140} r={140} fill="url(#sunGlow)" />
        <Defs>
          <RadialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor={shade(tint, 0.92)} stopOpacity="1" />
            <Stop offset="0.7" stopColor={shade(tint, 0.92)} stopOpacity="0" />
          </RadialGradient>
        </Defs>
      </Svg>

      {scene === 'banquise' && (
        <>
          <Hills color="#FBFEFF" />
          {SNOW.map((flake, i) => (
            <Drift
              key={i}
              axis="y"
              from={-flake.size}
              to={height + 120 - flake.size}
              phase={flake.phase}
              duration={flake.duration}
              sway={flake.sway}
              spin
              style={{left: `${flake.across}%`, opacity: flake.opacity}}>
              {flake.star ? (
                <MaterialCommunityIcons
                  name="snowflake"
                  size={flake.size}
                  color="#fff"
                />
              ) : (
                <View
                  style={{
                    width: flake.size,
                    height: flake.size,
                    borderRadius: flake.size / 2,
                    backgroundColor: '#fff',
                  }}
                />
              )}
            </Drift>
          ))}
        </>
      )}

      {scene === 'bulles' && (
        <>
          {BUBBLES.map((bubble, i) => (
            <Drift
              key={i}
              axis="y"
              from={height + 60}
              to={-bubble.size}
              phase={bubble.phase}
              duration={bubble.duration}
              sway={bubble.sway}
              style={{left: `${bubble.across}%`, opacity: 0.2}}>
              <View
                style={{
                  width: bubble.size,
                  height: bubble.size,
                  borderRadius: bubble.size / 2,
                  backgroundColor: bubble.color,
                }}
              />
            </Drift>
          ))}
          {/* après les bulles : elles sortent de derrière le sol */}
          <Hills color={shade(tint, 0.38)} />
        </>
      )}

      {scene === 'nuages' && (
        <>
          <Svg
            width={104}
            height={104}
            viewBox="0 0 104 104"
            style={{position: 'absolute', top: '24%', right: '8%'}}>
            <Circle cx={52} cy={52} r={50} fill={NOL.star} opacity={0.12} />
            <Path
              d="M52 7V15 M52 89V97 M7 52H15 M89 52H97 M20 20L26 26 M78 78L84 84 M20 84L26 78 M78 26L84 20"
              stroke={shade(NOL.star, 0.2)}
              strokeWidth={4}
              strokeLinecap="round"
              opacity={0.65}
            />
            <Circle cx={52} cy={52} r={28} fill={shade(NOL.star, 0.35)} />
          </Svg>
          {CLOUDS.map((cloud, i) => (
            <Drift
              key={i}
              axis="x"
              from={-CLOUD_WIDTH * cloud.scale * 1.5}
              to={width + CLOUD_WIDTH * cloud.scale}
              phase={cloud.phase}
              duration={cloud.duration}
              sway={4}
              style={{top: `${cloud.top}%`}}>
              <View style={{transform: [{scale: cloud.scale}]}}>
                <Cloud opacity={cloud.opacity} />
              </View>
            </Drift>
          ))}
          {/* après les nuages : ceux du bas passent derrière les collines */}
          <Hills color={shade(NOL.mint, 0.35)} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hills: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
  },
});
