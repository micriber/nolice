import {MaterialCommunityIcons} from '@expo/vector-icons';
import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Image, ViewStyle} from 'react-native';

import {AnimalImage} from '../screens/game/animal-picture';
import {MascotKey, useSettingsStore} from '../store/settings';
import {NOL} from '../utils/color';

export const MASCOTS: {key: MascotKey; label: string}[] = [
  {key: 'owl', label: 'Nolice'},
  {key: 'cat', label: 'Chat'},
  {key: 'dog', label: 'Chien'},
  {key: 'sheep', label: 'Mouton'},
  {key: 'duck', label: 'Canard'},
  {key: 'bird', label: 'Oiseau'},
  {key: 'pig', label: 'Cochon'},
  {key: 'rabbit', label: 'Lapin'},
  {key: 'cow', label: 'Vache'},
];

export type MascotMood = 'none' | 'happy' | 'content' | 'sad';
export type MascotAnim = 'float' | 'bob' | 'jump' | 'none';

type Props = {
  size?: number;
  mood?: MascotMood;
  anim?: MascotAnim;
  who?: MascotKey;
  style?: ViewStyle;
};

function MascotFace({who, size}: {who: MascotKey; size: number}) {
  if (who !== 'owl') return <AnimalImage type={who} size={size} />;
  return (
    <Image
      source={require('../../assets/branding/nolice.png')}
      style={{width: size, height: size}}
      resizeMode="contain"
      fadeDuration={0}
    />
  );
}

// Petite étincelle qui scintille (humeurs happy/content).
function Sparkle({
  left,
  top,
  size,
  delay,
  duration,
}: {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
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
        left,
        top,
        opacity: v.interpolate({inputRange: [0, 1], outputRange: [0.55, 1]}),
        transform: [
          {scale: v.interpolate({inputRange: [0, 1], outputRange: [1, 1.25]})},
        ],
      }}>
      <MaterialCommunityIcons name="star" size={size} color={NOL.star} />
    </Animated.View>
  );
}

// Larme qui coule (humeur triste).
function Tear({size, who}: {size: number; who: MascotKey}) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(v, {
          toValue: 1,
          duration: 1800,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(v, {toValue: 0, duration: 0, useNativeDriver: true}),
      ]),
    );
    anim.start();
    return () => {
      anim.stop();
    };
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: size * (who === 'owl' ? 0.35 : who === 'bird' ? 0.59 : 0.5),
        top: size * (who === 'rabbit' ? 0.44 : who === 'owl' ? 0.4 : 0.36),
        width: size * 0.1,
        height: size * 0.13,
        borderTopLeftRadius: size * 0.05,
        borderTopRightRadius: size * 0.05,
        borderBottomLeftRadius: size * 0.07,
        borderBottomRightRadius: size * 0.07,
        backgroundColor: '#5CC6F0',
        opacity: v.interpolate({
          inputRange: [0, 0.25, 1],
          outputRange: [0, 1, 0],
        }),
        transform: [
          {
            translateY: v.interpolate({
              inputRange: [0, 1],
              outputRange: [0, size * 0.18],
            }),
          },
          {scale: v.interpolate({inputRange: [0, 1], outputRange: [0.6, 1]})},
        ],
      }}
    />
  );
}

export default function Mascot({
  size = 120,
  mood = 'none',
  anim = 'float',
  who,
  style,
}: Props) {
  const settingsMascot = useSettingsStore((s) => s.mascot);
  const w = who ?? settingsMascot;
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    v.setValue(0);
    let animation: Animated.CompositeAnimation | null = null;
    const effective = mood === 'sad' ? 'sway' : anim;
    const loopUpDown = (duration: number) =>
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
      );
    if (effective === 'float') animation = loopUpDown(4000);
    if (effective === 'bob') animation = loopUpDown(2400);
    if (effective === 'sway') animation = loopUpDown(2600);
    if (effective === 'jump') {
      animation = Animated.sequence([
        Animated.timing(v, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(v, {
          toValue: 0,
          duration: 250,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(v, {
          toValue: 0.4,
          duration: 150,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(v, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]);
    }
    animation?.start();
    return () => animation?.stop();
  }, [anim, mood]);

  const sad = mood === 'sad';
  const transform: any[] = sad
    ? [
        {
          rotate: v.interpolate({
            inputRange: [0, 1],
            outputRange: ['-7deg', '-3deg'],
          }),
        },
        {
          translateY: v.interpolate({inputRange: [0, 1], outputRange: [0, 3]}),
        },
      ]
    : [
        {
          translateY: v.interpolate({
            inputRange: [0, 1],
            outputRange: [0, anim === 'jump' ? -26 : anim === 'bob' ? -6 : -10],
          }),
        },
      ];

  const sp = size * 0.2;

  return (
    <Animated.View style={[{width: size, height: size, transform}, style]}>
      <MascotFace who={w} size={size} />

      {/* HYPER CONTENTE : étincelles */}
      {mood === 'happy' && (
        <>
          <Sparkle
            left={-size * 0.06}
            top={size * 0.02}
            size={sp}
            delay={0}
            duration={1400}
          />
          <Sparkle
            left={size * 0.86}
            top={size * 0.1}
            size={sp * 0.7}
            delay={250}
            duration={1700}
          />
          <Sparkle
            left={size * 0.9}
            top={size * 0.6}
            size={sp * 0.85}
            delay={500}
            duration={2000}
          />
        </>
      )}

      {/* CONTENTE : une petite étincelle discrète */}
      {mood === 'content' && (
        <Sparkle
          left={size * 0.86}
          top={size * 0.08}
          size={sp * 0.7}
          delay={0}
          duration={1800}
        />
      )}

      {/* TRISTE : larme qui coule */}
      {sad && <Tear size={size} who={w} />}
    </Animated.View>
  );
}
