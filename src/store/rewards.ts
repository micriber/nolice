import * as Sentry from '@sentry/react-native';
import {File, Paths} from 'expo-file-system';
import {create} from 'zustand';

import type {DecorKey, MascotKey, MusicTrackKey} from './settings';
import type {GameKey} from '../utils/color';
import {
  DECOR_UNLOCKS,
  MASCOT_UNLOCKS,
  Owned,
  Reward,
  TRACK_UNLOCKS,
  rewardFor,
} from '../utils/rewards';

type Saved = {
  mascots: MascotKey[];
  decors: DecorKey[];
  tracks: MusicTrackKey[];
};

const NOTHING: Saved = {mascots: [], decors: [], tracks: []};

interface RewardsState extends Saved {
  claim: (gameId: string, game: GameKey, score: number) => Reward | null;
}

const rewardsFile = () => new File(Paths.document, 'nolice-rewards.json');

const known = <K extends string>(keys: unknown, unlocks: object): K[] =>
  Array.isArray(keys) ? keys.filter((key): key is K => key in unlocks) : [];

function loadRewards(): Saved {
  try {
    const file = rewardsFile();
    if (!file.exists) return NOTHING;
    const saved = JSON.parse(file.textSync());
    return {
      mascots: known(saved?.mascots, MASCOT_UNLOCKS),
      decors: known(saved?.decors, DECOR_UNLOCKS),
      tracks: known(saved?.tracks, TRACK_UNLOCKS),
    };
  } catch (err: any) {
    Sentry.logger.error('Rewards error: load', {
      error: err?.message ?? String(err),
    });
    return NOTHING;
  }
}

function saveRewards(saved: Saved) {
  try {
    rewardsFile().write(JSON.stringify(saved));
  } catch (err: any) {
    Sentry.logger.error('Rewards error: save', {
      error: err?.message ?? String(err),
    });
    Sentry.captureException(err);
  }
}

let lastClaim: {gameId: string; reward: Reward | null} | null = null;

export const useRewardsStore = create<RewardsState>((set, get) => ({
  ...loadRewards(),
  claim: (gameId, game, score) => {
    // L'écran de score peut se remonter : une partie ne se réclame qu'une fois.
    if (lastClaim?.gameId === gameId) return lastClaim.reward;
    const owned: Owned = get();
    const reward = rewardFor(game, score, owned);
    lastClaim = {gameId, reward};
    if (!reward) return null;
    const saved: Saved = {
      mascots: [...owned.mascots],
      decors: [...owned.decors],
      tracks: [...owned.tracks],
    };
    if (reward.kind === 'mascot') saved.mascots.push(reward.key);
    if (reward.kind === 'decor') saved.decors.push(reward.key);
    if (reward.kind === 'track') saved.tracks.push(reward.key);
    set(saved);
    saveRewards(saved);
    return reward;
  },
}));
