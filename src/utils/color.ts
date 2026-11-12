// Palette « Nolice — Banquise » (refonte 2026)
export const NOL = {
  ink: '#163A55',
  inkSoft: '#4D7794',
  sky: '#33A8D6',
  skyDeep: '#1B8CBE',
  ice: '#EAF6FB',
  iceMid: '#D6ECF7',
  iceDeep: '#C2E1F1',
  white: '#FFFFFF',
  coral: '#FF7059',
  coralDeep: '#E8512F',
  amber: '#FFB23E',
  amberDeep: '#F09019',
  violet: '#9B7EDE',
  violetDeep: '#7C5BCB',
  teal: '#1FC4C6',
  tealDeep: '#0FA1A3',
  mint: '#37C98B',
  mintDeep: '#1FA86F',
  star: '#FFC93C',
  starDeep: '#F0A91C',
};

// Éclaircit (amt > 0) ou assombrit (amt < 0) une couleur hex.
export function shade(hex: string, amt: number): string {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = parseInt(h, 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  r = Math.round(r + (amt < 0 ? r : 255 - r) * amt);
  g = Math.round(g + (amt < 0 ? g : 255 - g) * amt);
  b = Math.round(b + (amt < 0 ? b : 255 - b) * amt);
  const c = (v: number) =>
    Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0');
  return '#' + c(r) + c(g) + c(b);
}

export type GameKey = 'number' | 'animal' | 'color' | 'shape' | 'letter';

export type GameConfig = {
  key: GameKey;
  label: string;
  color: string;
  deep: string;
};

// Chaque jeu a sa couleur (cartes de l'accueil + teinte de l'écran de jeu).
export const GAMES: GameConfig[] = [
  {key: 'number', label: 'Les nombres', color: NOL.amber, deep: NOL.amberDeep},
  {key: 'animal', label: 'Les animaux', color: NOL.coral, deep: NOL.coralDeep},
  {
    key: 'color',
    label: 'Les couleurs',
    color: NOL.violet,
    deep: NOL.violetDeep,
  },
  {key: 'shape', label: 'Les formes', color: NOL.teal, deep: NOL.tealDeep},
  {key: 'letter', label: 'Les lettres', color: NOL.mint, deep: NOL.mintDeep},
];

export function gameConfig(key: GameKey): GameConfig {
  return GAMES.find((g) => g.key === key) ?? GAMES[0];
}

export default NOL;
