import {MaterialCommunityIcons} from '@expo/vector-icons';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, Pressable, useWindowDimensions} from 'react-native';

import Mascot from './Mascot';
import {NOL} from '../utils/color';
import {useScale} from '../utils/scale';

type Props = {
  // false tant qu'un panneau cache le bas de l'écran : la visite et l'attente se figent.
  active: boolean;
};

type Range = [number, number];

// walk : traverse le bas de l'écran. peek : sort du bas, saute sur place, redescend.
type Visit = {kind: 'walk'; leftward: boolean} | {kind: 'peek'; at: number};

const FIRST_WAIT: Range = [10000, 20000];
const WAIT: Range = [30000, 60000];
const DURATION = {walk: 10000, peek: 5000};
const BOTTOM = 36;

const between = ([min, max]: Range) => min + Math.random() * (max - min);

const pickVisit = (): Visit =>
  Math.random() < 0.5
    ? {kind: 'walk', leftward: Math.random() < 0.5}
    : {kind: 'peek', at: Math.random()};

const HOPS = 10;
const WALK_STEPS = Array.from({length: HOPS * 8 + 1}, (_, i) => i / (HOPS * 8));
const walkHop = (step: number) => Math.abs(Math.sin(Math.PI * HOPS * step));

const JUMPS = 4;
const PEEK_EDGE = 0.16;
const PEEK_STEPS = Array.from({length: 101}, (_, i) => i / 100);
// 0 : cachée sous l'écran, 1 : sortie. La montée ralentit en arrivant, la descente accélère.
const peekOut = (step: number) => {
  const edge = Math.min(step, 1 - step) / PEEK_EDGE;
  return edge >= 1 ? 1 : Math.sin((edge * Math.PI) / 2);
};
const peekJump = (step: number) => {
  const stay = (step - PEEK_EDGE) / (1 - 2 * PEEK_EDGE);
  return stay <= 0 || stay >= 1
    ? 0
    : Math.abs(Math.sin(Math.PI * JUMPS * stay));
};

// Décalage horizontal et retard de chaque cœur, en part de la taille de la mascotte et de la durée.
const HEARTS: [number, number][] = [
  [0.1, 0],
  [0.42, 0.15],
  [0.7, 0.3],
];

// Cœurs qui s'envolent au-dessus de la mascotte, une fois.
function Hearts({size}: {size: number}) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, {
      toValue: 1,
      duration: 1100,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <>
      {HEARTS.map(([left, delay], i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: left * size,
            top: -size * 0.2,
            opacity: v.interpolate({
              inputRange: [delay, delay + 0.15, 0.8, 1],
              outputRange: [0, 1, 1, 0],
            }),
            transform: [
              {
                translateY: v.interpolate({
                  inputRange: [delay, 1],
                  outputRange: [0, -size * 0.55],
                  extrapolateLeft: 'clamp',
                }),
              },
              {
                scale: v.interpolate({
                  inputRange: [delay, delay + 0.2],
                  outputRange: [0.5, 1],
                  extrapolate: 'clamp',
                }),
              },
            ],
          }}>
          <MaterialCommunityIcons
            name="heart"
            size={size * 0.26}
            color={NOL.coral}
          />
        </Animated.View>
      ))}
    </>
  );
}

// La mascotte en visite : la toucher fait s'envoler des cœurs.
function TouchableMascot({size}: {size: number}) {
  const [bursts, setBursts] = useState(0);
  return (
    <Pressable
      onPress={() => {
        setBursts((count) => count + 1);
      }}>
      <Mascot size={size} anim="none" />
      {bursts > 0 && <Hearts key={bursts} size={size} />}
    </Pressable>
  );
}

// De temps en temps, la mascotte rend visite en bas de l'écran, par une animation tirée au sort.
export default function MascotVisit({active}: Props) {
  const {width} = useWindowDimensions();
  const scale = useScale();
  const size = 70 * scale;
  const progress = useRef(new Animated.Value(0)).current;
  // duration > 0 : une visite est en cours, `played` en est la part déjà jouée.
  const [pending] = useState(() => ({
    wait: between(FIRST_WAIT),
    duration: 0,
    played: 0,
  }));
  const [visit, setVisit] = useState<Visit | null>(null);

  useEffect(() => {
    if (!active) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let waitingSince = Date.now();
    const play = () => {
      Animated.timing(progress, {
        toValue: 1,
        duration: pending.duration * (1 - pending.played),
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({finished}) => {
        if (!finished) return;
        pending.duration = 0;
        pending.played = 0;
        pending.wait = between(WAIT);
        progress.setValue(0);
        setVisit(null);
        waitingSince = Date.now();
        timer = setTimeout(start, pending.wait);
      });
    };
    const start = () => {
      const next = pickVisit();
      pending.duration = DURATION[next.kind];
      setVisit(next);
      play();
    };
    if (pending.duration > 0) play();
    else timer = setTimeout(start, pending.wait);
    return () => {
      clearTimeout(timer);
      if (pending.duration > 0) {
        progress.stopAnimation((value) => {
          pending.played = value;
        });
      } else {
        pending.wait = Math.max(0, pending.wait - (Date.now() - waitingSince));
      }
    };
  }, [active]);

  if (!visit) return null;
  const hidden = size + BOTTOM + 10;
  const transform =
    visit.kind === 'walk'
      ? [
          {
            translateX: progress.interpolate({
              inputRange: [0, 1],
              outputRange: visit.leftward ? [width, -size] : [-size, width],
            }),
          },
          {
            translateY: progress.interpolate({
              inputRange: WALK_STEPS,
              outputRange: WALK_STEPS.map(
                (step) => -10 * scale * walkHop(step),
              ),
            }),
          },
          // Les mascottes sont dessinées tournées vers la droite.
          {scaleX: visit.leftward ? -1 : 1},
        ]
      : [
          {translateX: visit.at * (width - size)},
          {
            translateY: progress.interpolate({
              inputRange: PEEK_STEPS,
              outputRange: PEEK_STEPS.map(
                (step) =>
                  hidden * (1 - peekOut(step)) - 24 * scale * peekJump(step),
              ),
            }),
          },
        ];
  return (
    <Animated.View
      style={{position: 'absolute', left: 0, bottom: BOTTOM, transform}}>
      <TouchableMascot size={size} />
    </Animated.View>
  );
}
