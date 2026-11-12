import React, {useId} from 'react';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import {NOL, shade} from '../../utils/color';

export const SHAPE_COLORS = [
  NOL.coral,
  NOL.amber,
  NOL.violet,
  NOL.teal,
  NOL.mint,
  NOL.sky,
];

export const SHAPES: Record<string, React.ReactElement> = {
  circle: <Circle cx="100" cy="100" r="77" />,
  cross: (
    <Path d="M 82 20 H 118 Q 122 20 122 24 V 78 H 176 Q 180 78 180 82 V 118 Q 180 122 176 122 H 122 V 176 Q 122 180 118 180 H 82 Q 78 180 78 176 V 122 H 24 Q 20 122 20 118 V 82 Q 20 78 24 78 H 78 V 24 Q 78 20 82 20 Z" />
  ),
  heart: (
    <Path d="M 100 174 C 82 157 24 115 24 73 C 24 29 75 17 100 53 C 125 17 176 29 176 73 C 176 115 118 157 100 174 Z" />
  ),
  losange: <Path d="M 100 18 L 177 100 L 100 182 L 23 100 Z" />,
  oval: <Ellipse cx="100" cy="100" rx="82" ry="57" />,
  rectangle: <Rect x="20" y="49" width="160" height="102" rx="5" />,
  square: <Rect x="30" y="30" width="140" height="140" rx="5" />,
  star: (
    <Path d="M 100 18 L 123 70 L 180 76 L 137 115 L 149 172 L 100 143 L 51 172 L 63 115 L 20 76 L 77 70 Z" />
  ),
  triangle: <Path d="M 100 24 L 181 166 L 19 166 Z" />,
};

const DEFAULT_COLORS: Record<string, string> = {
  circle: NOL.coral,
  cross: NOL.violet,
  heart: NOL.coral,
  losange: NOL.violet,
  oval: NOL.teal,
  rectangle: NOL.sky,
  square: NOL.teal,
  star: NOL.amber,
  triangle: NOL.mint,
};

export function ShapeImage({
  type = 'heart',
  size,
  color,
}: {
  type?: string;
  size: number;
  color?: string;
}) {
  const gradientId = useId();
  const shape = SHAPES[type];
  if (!shape) return null;
  const fill = color ?? DEFAULT_COLORS[type];
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={shade(fill, 0.2)} />
          <Stop offset="1" stopColor={fill} />
        </LinearGradient>
      </Defs>
      <G
        fill={`url(#${gradientId})`}
        stroke={shade(fill, -0.18)}
        strokeWidth={3}
        strokeLinejoin="round">
        {shape}
      </G>
    </Svg>
  );
}
