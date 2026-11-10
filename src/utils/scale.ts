import {useWindowDimensions} from 'react-native';

const DESIGN_WIDTH = 412;
const DESIGN_HEIGHT = 700;
const MAX_SCALE = 2;

export function fitScale(
  width: number,
  height: number,
  designHeight = DESIGN_HEIGHT,
) {
  const scale = Math.min(width / DESIGN_WIDTH, height / designHeight);
  return Math.min(Math.max(scale, 1), MAX_SCALE);
}

// Agrandissement par rapport à la maquette téléphone : 1 sur un téléphone, jusqu'à 2 sur une tablette.
// La hauteur compte aussi : une page haute de designHeight sur la maquette doit tenir sans déborder.
export function useScale(designHeight?: number) {
  const {width, height} = useWindowDimensions();
  return fitScale(width, height, designHeight);
}
