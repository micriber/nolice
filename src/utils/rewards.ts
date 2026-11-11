import {GameKey, gameConfig} from './color';
import type {DecorKey, MascotKey} from '../store/settings';

// Ce qu'il faut réussir pour gagner une récompense : une ou deux parties d'un jeu
// avec au moins 9 sur 10, ou un sans-faute dans n'importe quel jeu.
export type Unlock = {game: GameKey; successes: 1 | 2} | 'perfect';

export const MASCOT_UNLOCKS: Partial<Record<MascotKey, Unlock>> = {
  sheep: {game: 'number', successes: 1},
  duck: {game: 'animal', successes: 1},
  bird: {game: 'color', successes: 1},
  pig: {game: 'shape', successes: 1},
  rabbit: 'perfect',
  cow: 'perfect',
};

export const DECOR_UNLOCKS: Partial<Record<DecorKey, Unlock>> = {
  banquise: {game: 'shape', successes: 2},
  automne: {game: 'animal', successes: 2},
};

// Récompenses dont le contenu reste à créer : deux musiques.
export const UPCOMING_TRACK_UNLOCKS: Unlock[] = [
  {game: 'number', successes: 2},
  {game: 'color', successes: 2},
];

export const SUCCESS_SCORE = 9;
export const PERFECT_SCORE = 10;

export type Reward =
  | {kind: 'mascot'; key: MascotKey}
  | {kind: 'decor'; key: DecorKey};

export type Owned = {
  mascots: readonly MascotKey[];
  decors: readonly DecorKey[];
};

const owns = (owned: Owned, reward: Reward) =>
  reward.kind === 'mascot'
    ? owned.mascots.includes(reward.key)
    : owned.decors.includes(reward.key);

// La règle qui verrouille encore cette mascotte ou ce décor ; rien s'il est de base ou déjà gagné.
export function lockOf(reward: Reward, owned: Owned): Unlock | undefined {
  if (owns(owned, reward)) return undefined;
  return reward.kind === 'mascot'
    ? MASCOT_UNLOCKS[reward.key]
    : DECOR_UNLOCKS[reward.key];
}

const REWARDS: Reward[] = [
  ...(Object.keys(MASCOT_UNLOCKS) as MascotKey[]).map(
    (key): Reward => ({kind: 'mascot', key}),
  ),
  ...(Object.keys(DECOR_UNLOCKS) as DecorKey[]).map(
    (key): Reward => ({kind: 'decor', key}),
  ),
];

// Une partie donne au plus une récompense : au sans-faute, une mascotte du sans-faute tant qu'il en
// reste ; sinon, à partir de 9 sur 10, la récompense suivante du jeu (sa mascotte, puis son décor).
export function rewardFor(
  game: GameKey,
  score: number,
  owned: Owned,
): Reward | null {
  const left = REWARDS.flatMap((reward) => {
    const unlock = lockOf(reward, owned);
    return unlock ? [{reward, unlock}] : [];
  });
  if (score >= PERFECT_SCORE) {
    const perfect = left.find(({unlock}) => unlock === 'perfect');
    if (perfect) return perfect.reward;
  }
  if (score < SUCCESS_SCORE) return null;
  const ofGame = left.flatMap(({reward, unlock}) =>
    unlock !== 'perfect' && unlock.game === game
      ? [{reward, successes: unlock.successes}]
      : [],
  );
  ofGame.sort((a, b) => a.successes - b.successes);
  return ofGame[0]?.reward ?? null;
}

export function unlockHint(unlock: Unlock) {
  if (unlock === 'perfect') {
    return 'Fais un sans-faute, 10 sur 10, dans n’importe quel jeu.';
  }
  const times = unlock.successes === 1 ? '' : 'deux fois ';
  return `Termine ${times}le jeu « ${gameConfig(unlock.game).label} » avec au moins 9 bonnes réponses sur 10.`;
}
