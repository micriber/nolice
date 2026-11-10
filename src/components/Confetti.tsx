import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet, useWindowDimensions} from 'react-native';

import {NOL} from '../utils/color';

const PALETTE = [
  NOL.coral,
  NOL.amber,
  NOL.teal,
  NOL.mint,
  NOL.violet,
  NOL.star,
];

type Piece = {
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  rotation: number;
  round: boolean;
};

function makePieces(count: number): Piece[] {
  return Array.from({length: count}).map((_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 500,
    duration: 1400 + Math.random() * 1100,
    size: 8 + Math.random() * 8,
    color: PALETTE[i % PALETTE.length],
    rotation: Math.random() * 360,
    round: Math.random() > 0.5,
  }));
}

function ConfettiPiece({piece, fall}: {piece: Piece; fall: number}) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(piece.delay),
      Animated.timing(v, {
        toValue: 1,
        duration: piece.duration,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: -30,
        left: `${piece.left}%`,
        width: piece.size,
        height: piece.size * (piece.round ? 1 : 1.3),
        backgroundColor: piece.color,
        borderRadius: piece.round ? piece.size / 2 : 3,
        opacity: v.interpolate({
          inputRange: [0, 0.8, 1],
          outputRange: [1, 1, 0],
        }),
        transform: [
          {
            translateY: v.interpolate({
              inputRange: [0, 1],
              outputRange: [0, fall],
            }),
          },
          {
            rotate: v.interpolate({
              inputRange: [0, 1],
              outputRange: [
                `${piece.rotation}deg`,
                `${piece.rotation + 720}deg`,
              ],
            }),
          },
        ],
      }}
    />
  );
}

// Pluie de confettis (bonne réponse / score « hyper content »). Joue une fois.
export default function Confetti() {
  const {height} = useWindowDimensions();
  const pieces = useRef(makePieces(34)).current;
  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.layer]}
      pointerEvents="none">
      {pieces.map((p, i) => (
        <ConfettiPiece key={i} piece={p} fall={height * 0.8} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: {
    overflow: 'hidden',
    zIndex: 80,
  },
});
