import {GAMES} from './color';
import {
  DECOR_UNLOCKS,
  MASCOT_UNLOCKS,
  UPCOMING_DECOR_UNLOCK,
  UPCOMING_TRACK_UNLOCKS,
  Owned,
  Unlock,
  rewardFor,
  unlockHint,
} from './rewards';

const mascots = Object.values(MASCOT_UNLOCKS);
const others = [
  ...Object.values(DECOR_UNLOCKS),
  UPCOMING_DECOR_UNLOCK,
  ...UPCOMING_TRACK_UNLOCKS,
];

const gamesAt = (unlocks: Unlock[], successes: number) =>
  unlocks
    .flatMap((unlock) =>
      unlock !== 'perfect' && unlock.successes === successes
        ? [unlock.game]
        : [],
    )
    .sort();

const allGames = GAMES.map((game) => game.key).sort();

// Le plan des récompenses : dix en tout, une mascotte puis un décor ou une musique par jeu, deux mascottes au sans-faute.
describe('reward plan', () => {
  it('holds ten rewards', () => {
    expect(mascots).toHaveLength(6);
    expect(others).toHaveLength(4);
  });

  it('gives each game one mascot on its first success', () => {
    expect(gamesAt(mascots, 1)).toEqual(allGames);
  });

  it('gives each game one decor or track on its second success', () => {
    expect(gamesAt(others, 2)).toEqual(allGames);
  });

  it('keeps two mascots for a perfect game', () => {
    expect(mascots.filter((unlock) => unlock === 'perfect')).toHaveLength(2);
  });
});

describe('unlockHint', () => {
  it.each<[Unlock, string]>([
    [
      {game: 'number', successes: 1},
      'Termine le jeu « Les nombres » avec au moins 9 bonnes réponses sur 10.',
    ],
    [
      {game: 'shape', successes: 2},
      'Termine deux fois le jeu « Les formes » avec au moins 9 bonnes réponses sur 10.',
    ],
    ['perfect', 'Fais un sans-faute, 10 sur 10, dans n’importe quel jeu.'],
  ])('explains %j', (unlock, hint) => {
    expect(unlockHint(unlock)).toBe(hint);
  });
});

describe('rewardFor', () => {
  const nothing: Owned = {mascots: [], decors: []};

  it('gives nothing below 9', () => {
    expect(rewardFor('shape', 8, nothing)).toBeNull();
  });

  it('gives the mascot of the game on its first success', () => {
    expect(rewardFor('number', 9, nothing)).toEqual({
      kind: 'mascot',
      key: 'sheep',
    });
  });

  it('gives the decor of the game on its second success', () => {
    expect(rewardFor('shape', 9, {mascots: ['pig'], decors: []})).toEqual({
      kind: 'decor',
      key: 'banquise',
    });
  });

  it('gives nothing once the game has no reward left', () => {
    const owned: Owned = {mascots: ['pig'], decors: ['banquise']};

    expect(rewardFor('shape', 9, owned)).toBeNull();
  });

  it('gives nothing for a second reward that does not exist yet', () => {
    expect(rewardFor('number', 9, {mascots: ['sheep'], decors: []})).toBeNull();
  });

  it('gives a perfect-game mascot first, one per perfect game', () => {
    expect(rewardFor('color', 10, nothing)).toEqual({
      kind: 'mascot',
      key: 'rabbit',
    });
    expect(rewardFor('color', 10, {mascots: ['rabbit'], decors: []})).toEqual({
      kind: 'mascot',
      key: 'cow',
    });
  });

  it('falls back to the reward of the game once both perfect-game mascots are won', () => {
    const owned: Owned = {mascots: ['rabbit', 'cow'], decors: []};

    expect(rewardFor('color', 10, owned)).toEqual({
      kind: 'mascot',
      key: 'bird',
    });
  });

  it('hands out every existing reward, one per winning game', () => {
    const owned = {mascots: [] as string[], decors: [] as string[]};
    let games = 0;
    for (const game of [...allGames, ...allGames, ...allGames]) {
      const reward = rewardFor(game, 10, owned as Owned);
      if (!reward) continue;
      games++;
      (reward.kind === 'mascot' ? owned.mascots : owned.decors).push(
        reward.key,
      );
    }

    expect(owned.mascots).toHaveLength(6);
    expect(owned.decors).toEqual(['banquise']);
    expect(games).toBe(7);
  });
});
