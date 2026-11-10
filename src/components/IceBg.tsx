import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
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

// Boucle douce de flottement vertical (décors bulles/nuages).
function FloatLoop({
  duration,
  delay,
  distance = 10,
  children,
  style,
}: {
  duration: number;
  delay: number;
  distance?: number;
  children: React.ReactNode;
  style?: object;
}) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.sequence([
      Animated.delay(delay),
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, {
            toValue: 1,
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: 0,
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ),
    ]);
    anim.start();
    return () => {
      anim.stop();
    };
  }, []);
  const translateY = v.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -distance],
  });
  return (
    <Animated.View style={[style, {transform: [{translateY}]}]}>
      {children}
    </Animated.View>
  );
}

// Flocon qui scintille (décor banquise).
function Twinkle({
  left,
  top,
  size,
  opacity,
  duration,
  delay,
}: {
  left: number;
  top: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.sequence([
      Animated.delay(delay),
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, {
            toValue: 1,
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: 0,
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ),
    ]);
    anim.start();
    return () => {
      anim.stop();
    };
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: `${(left / 412) * 100}%`,
        top,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#fff',
        opacity: v.interpolate({
          inputRange: [0, 1],
          outputRange: [opacity * 0.55, opacity],
        }),
        transform: [
          {scale: v.interpolate({inputRange: [0, 1], outputRange: [1, 1.25]})},
        ],
      }}
    />
  );
}

function Cloud({opacity}: {opacity: number}) {
  return (
    <Svg width={96} height={38} viewBox="0 0 96 38">
      <Path
        d="M14 35 C-3 35 -3 15 14 15 H25 C23 5 31 0 43 2 H61 C73 2 78 10 74 16 H81 C100 16 100 35 81 35 Z"
        fill="#fff"
        opacity={opacity}
      />
    </Svg>
  );
}

const FLAKES: [number, number, number, number][] = [
  [40, 120, 7, 0.5],
  [330, 180, 5, 0.4],
  [70, 300, 5, 0.35],
  [300, 360, 8, 0.5],
  [200, 90, 4, 0.4],
  [360, 470, 6, 0.4],
  [30, 520, 5, 0.3],
];

const BUBBLES: [number, number, number, string][] = [
  [44, 150, 56, NOL.coral],
  [320, 210, 70, NOL.amber],
  [76, 360, 48, NOL.teal],
  [300, 430, 60, NOL.violet],
  [186, 110, 34, NOL.mint],
  [350, 540, 44, NOL.coral],
  [24, 540, 38, NOL.amber],
];

const CLOUDS: [number, number, number, number][] = [
  [20, 150, 1.1, 0.95],
  [250, 225, 1.4, 0.9],
  [90, 340, 0.9, 0.85],
  [285, 430, 1.15, 0.9],
  [140, 540, 0.75, 0.85],
];

export default function IceBg({tint = NOL.sky, scene = 'nuages'}: Props) {
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
          {FLAKES.map((f, i) => (
            <Twinkle
              key={i}
              left={f[0]}
              top={f[1]}
              size={f[2]}
              opacity={f[3]}
              duration={2400 + i * 400}
              delay={i * 300}
            />
          ))}
          {/* collines de neige */}
          <FillSvg viewBox="0 0 412 260" style={styles.bottomSvg}>
            <Path
              d="M0 120 Q110 60 230 110 T412 90 L412 260 L0 260 Z"
              fill={shade(tint, 0.86)}
              opacity={0.7}
            />
            <Path
              d="M0 170 Q140 110 270 160 T412 150 L412 260 L0 260 Z"
              fill={shade(tint, 0.86)}
            />
          </FillSvg>
        </>
      )}

      {scene === 'bulles' && (
        <>
          {BUBBLES.map((b, i) => (
            <FloatLoop
              key={i}
              duration={3600 + i * 500}
              delay={i * 350}
              style={{
                position: 'absolute',
                left: `${(b[0] / 412) * 100}%`,
                top: b[1],
              }}>
              <View
                style={{
                  width: b[2],
                  height: b[2],
                  borderRadius: b[2] / 2,
                  backgroundColor: b[3],
                  opacity: 0.2,
                }}
              />
            </FloatLoop>
          ))}
        </>
      )}

      {scene === 'bulles' &&
        [
          {left: '7%', bottom: '7%', size: 54, color: NOL.teal},
          {left: '46%', bottom: '15%', size: 30, color: NOL.violet},
          {left: '83%', bottom: '4%', size: 72, color: NOL.amber},
        ].map((bubble, i) => (
          <FloatLoop
            key={`bottom-bubble-${i}`}
            duration={5200 + i * 600}
            delay={i * 300}
            distance={6}
            style={{
              position: 'absolute',
              left: bubble.left,
              bottom: bubble.bottom,
            }}>
            <View
              style={{
                width: bubble.size,
                height: bubble.size,
                borderRadius: bubble.size / 2,
                backgroundColor: bubble.color,
                opacity: 0.16,
              }}
            />
          </FloatLoop>
        ))}

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
          {[
            {left: '2%', bottom: '7%', scale: 1.5, opacity: 0.55},
            {left: '49%', bottom: '15%', scale: 0.85, opacity: 0.4},
            {left: '81%', bottom: '3%', scale: 1.8, opacity: 0.5},
          ].map((cloud, i) => (
            <FloatLoop
              key={`bottom-cloud-${i}`}
              duration={6500 + i * 700}
              delay={i * 450}
              distance={5}
              style={{
                position: 'absolute',
                left: cloud.left,
                bottom: cloud.bottom,
              }}>
              <View style={{transform: [{scale: cloud.scale}]}}>
                <Cloud opacity={cloud.opacity} />
              </View>
            </FloatLoop>
          ))}
          {CLOUDS.map((c, i) => (
            <FloatLoop
              key={i}
              duration={5000 + i * 700}
              delay={i * 450}
              style={{
                position: 'absolute',
                left: `${(c[0] / 412) * 100}%`,
                top: c[1],
              }}>
              <View style={{transform: [{scale: c[2]}]}}>
                <Cloud opacity={c[3]} />
              </View>
            </FloatLoop>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomSvg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
});
