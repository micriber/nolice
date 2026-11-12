import React from 'react';
import {Text, View} from 'react-native';

import {AnimalImage} from '../screens/game/animal-picture';
import {ColorImage} from '../screens/game/color-picture';
import {ShapeImage} from '../screens/game/shape-picture';
import {NOL, shade} from '../utils/color';
import FONT from '../utils/font';

// Pictogrammes des cartes de jeu — gros et lisibles sans savoir lire
// (retour de Bernard : les enfants choisissent le jeu avec l'icône).

// « 123 » pour le jeu des nombres (à la place du dé, qui portait à confusion).
export function Numerals({size}: {size: number}) {
  const cols = [NOL.coral, NOL.amberDeep, NOL.teal];
  return (
    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
      {['1', '2', '3'].map((d, i) => (
        <Text
          key={d}
          style={{
            fontFamily: FONT.DISPLAY_BOLD,
            fontSize: i === 1 ? size * 0.7 : size * 0.52,
            lineHeight: i === 1 ? size * 0.78 : size * 0.58,
            color: cols[i],
            marginHorizontal: size * 0.02,
          }}>
          {d}
        </Text>
      ))}
    </View>
  );
}

// « ABC » pour le jeu des lettres.
export function Letters({size}: {size: number}) {
  const cols = [NOL.coral, NOL.mintDeep, NOL.violet];
  return (
    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
      {['A', 'B', 'C'].map((letter, i) => (
        <Text
          key={letter}
          style={{
            fontFamily: FONT.UI_HEAVY,
            fontSize: i === 1 ? size * 0.62 : size * 0.46,
            lineHeight: i === 1 ? size * 0.7 : size * 0.52,
            color: cols[i],
            marginHorizontal: size * 0.01,
          }}>
          {letter}
        </Text>
      ))}
    </View>
  );
}

export function AnimalGlyph({size}: {size: number}) {
  return (
    <View style={{width: size, height: size}}>
      <View style={{position: 'absolute', left: 0, top: size * 0.06}}>
        <AnimalImage type="cat" size={size * 0.72} />
      </View>
      <View style={{position: 'absolute', right: 0, bottom: 0}}>
        <AnimalImage type="duck" size={size * 0.62} />
      </View>
    </View>
  );
}

export function PaletteGlyph({size}: {size: number}) {
  return (
    <View style={{width: size, height: size}}>
      <View style={{position: 'absolute', left: 0, top: size * 0.04}}>
        <ColorImage type="red" size={size * 0.62} />
      </View>
      <View style={{position: 'absolute', right: 0, top: size * 0.04}}>
        <ColorImage type="yellow" size={size * 0.62} />
      </View>
      <View style={{position: 'absolute', left: size * 0.19, bottom: 0}}>
        <ColorImage type="blue" size={size * 0.62} />
      </View>
    </View>
  );
}

// Grenouille, rond, grenouille, « ? » : une suite qui mêle animal et forme et dont il manque la fin.
// La case « ? » est celle du jeu : c'est elle qui distingue ce pictogramme de ceux des animaux et des formes.
export function SequenceGlyph({size}: {size: number}) {
  const cell = size / 2;
  const slot = cell * 0.86;
  return (
    <View
      style={{
        width: size,
        height: size,
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
      <AnimalImage type="frog" size={cell} />
      <ShapeImage type="circle" size={cell} color={NOL.amber} />
      <AnimalImage type="frog" size={cell} />
      <View
        style={{
          width: cell,
          height: cell,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: slot,
            height: slot,
            borderRadius: slot / 2,
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: NOL.pinkDeep,
            backgroundColor: shade(NOL.pink, 0.8),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: FONT.DISPLAY_BOLD,
              fontSize: slot * 0.62,
              lineHeight: slot * 0.8,
              color: NOL.pinkDeep,
            }}>
            ?
          </Text>
        </View>
      </View>
    </View>
  );
}

export function ShapeCluster({size}: {size: number}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
      {['circle', 'triangle', 'square', 'star'].map((type) => (
        <ShapeImage key={type} type={type} size={size / 2} />
      ))}
    </View>
  );
}
