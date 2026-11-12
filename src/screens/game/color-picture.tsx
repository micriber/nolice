import React from 'react';

// @ts-expect-error
import Black from '../../../assets/svg/splash-black.svg';
// @ts-expect-error
import Blue from '../../../assets/svg/splash-blue.svg';
// @ts-expect-error
import Brown from '../../../assets/svg/splash-brown.svg';
// @ts-expect-error
import Green from '../../../assets/svg/splash-green.svg';
// @ts-expect-error
import Grey from '../../../assets/svg/splash-grey.svg';
// @ts-expect-error
import Orange from '../../../assets/svg/splash-orange.svg';
// @ts-expect-error
import Pink from '../../../assets/svg/splash-pink.svg';
// @ts-expect-error
import Purple from '../../../assets/svg/splash-purple.svg';
// @ts-expect-error
import Red from '../../../assets/svg/splash-red.svg';
// @ts-expect-error
import White from '../../../assets/svg/splash-white.svg';
// @ts-expect-error
import Yellow from '../../../assets/svg/splash-yellow.svg';

export const COLORS_MAP: {[key: string]: React.ComponentType<any>} = {
  red: Red,
  yellow: Yellow,
  brown: Brown,
  blue: Blue,
  pink: Pink,
  green: Green,
  black: Black,
  purple: Purple,
  orange: Orange,
  grey: Grey,
  white: White,
};

// Teinte dominante de chaque éclaboussure (pastille « La réponse » du résultat).
export const COLOR_HEX: {[key: string]: string} = {
  red: '#E53935',
  yellow: '#F5D52E',
  brown: '#93613E',
  blue: '#3289DD',
  pink: '#F38ABB',
  green: '#35B95C',
  black: '#292929',
  purple: '#8D52C7',
  orange: '#F58A16',
  grey: '#959595',
  white: '#F5F4EF',
};

export function ColorImage({
  type = 'red',
  size,
}: {
  type?: string;
  size: number;
}) {
  const Color = COLORS_MAP[type];
  if (!Color) return null;
  return <Color width={size} height={size} />;
}
