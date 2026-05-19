import React from 'react';
import {View} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

// @ts-expect-error
import Circle from '../../../assets/svg/shape-circle.svg';
// @ts-expect-error
import Cross from '../../../assets/svg/shape-cross.svg';
// @ts-expect-error
import Heart from '../../../assets/svg/shape-heart.svg';
// @ts-expect-error
import Losange from '../../../assets/svg/shape-losange.svg';
// @ts-expect-error
import Oval from '../../../assets/svg/shape-oval.svg';
// @ts-expect-error
import Rectangle from '../../../assets/svg/shape-rectangle.svg';
// @ts-expect-error
import Square from '../../../assets/svg/shape-square.svg';
// @ts-expect-error
import Star from '../../../assets/svg/shape-star.svg';
// @ts-expect-error
import Triangle from '../../../assets/svg/shape-triangle.svg';

export function ShapeImage({type = 'heart'}) {
  let shape;
  switch (type) {
    case 'circle':
      shape = <Circle />;
      break;
    case 'cross':
      shape = <Cross />;
      break;
    case 'heart':
      shape = <Heart />;
      break;
    case 'losange':
      shape = <Losange />;
      break;
    case 'oval':
      shape = <Oval />;
      break;
    case 'rectangle':
      shape = <Rectangle />;
      break;
    case 'square':
      shape = <Square />;
      break;
    case 'star':
      shape = <Star />;
      break;
    case 'triangle':
      shape = <Triangle />;
      break;
  }
  return (
    <View
      style={[
        {
          height: RFPercentage(13),
          width: RFPercentage(10),
          flexGrow: 1,
        },
      ]}>
      {shape}
    </View>
  );
}
