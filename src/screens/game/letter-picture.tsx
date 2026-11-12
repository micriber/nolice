import React from 'react';
import {Text} from 'react-native';

import {NOL} from '../../utils/color';
import FONT from '../../utils/font';

// Sans le vert, couleur du jeu : la lettre se fondrait dans le fond de l'écran.
export const LETTER_COLORS = [
  NOL.coralDeep,
  NOL.amberDeep,
  NOL.violetDeep,
  NOL.tealDeep,
  NOL.skyDeep,
];

export const LETTERS: Record<string, string> = Object.fromEntries(
  Array.from('abcdefghijklmnopqrstuvwxyz', (key) => [key, key.toUpperCase()]),
);

export function LetterImage({
  type,
  size,
  color,
}: {
  type: string;
  size: number;
  color: string;
}) {
  return (
    // Nunito et non Fredoka, dont le B n'a qu'un seul creux : la lettre doit avoir sa forme d'école.
    <Text style={{fontFamily: FONT.UI_HEAVY, fontSize: size, color}}>
      {LETTERS[type]}
    </Text>
  );
}
