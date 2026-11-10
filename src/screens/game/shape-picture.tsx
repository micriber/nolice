import React from 'react';

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

export const SHAPES: {[key: string]: React.ComponentType<any>} = {
  circle: Circle,
  cross: Cross,
  heart: Heart,
  losange: Losange,
  oval: Oval,
  rectangle: Rectangle,
  square: Square,
  star: Star,
  triangle: Triangle,
};

export function ShapeImage({
  type = 'heart',
  size,
}: {
  type?: string;
  size: number;
}) {
  const Shape = SHAPES[type];
  if (!Shape) return null;
  return <Shape width={size} height={size} />;
}
