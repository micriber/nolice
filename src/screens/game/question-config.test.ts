import {ANIMALS} from './animal-picture';
import {COLORS_MAP} from './color-picture';
import {LETTERS} from './letter-picture';
import {FindGameKey, QUESTION_CONFIGS} from './question-config';
import {SHAPES} from './shape-picture';
import {SOUNDS_QUESTION, SOUNDS_SEQUENCE_ANSWER} from '../../store/audio';

jest.mock('expo-audio', () => ({}));
jest.mock('@sentry/react-native', () => ({}));

const PICTURES: Record<FindGameKey, {[key: string]: unknown}> = {
  animal: ANIMALS,
  color: COLORS_MAP,
  shape: SHAPES,
  letter: LETTERS,
};

const gameTypes = Object.keys(QUESTION_CONFIGS) as FindGameKey[];

describe.each(gameTypes)('%s questions', (gameType) => {
  const keys = QUESTION_CONFIGS[gameType].map((item) => item.key);
  const sounds = SOUNDS_QUESTION[gameType.toUpperCase()];

  it('has enough items for 4 choices, each listed once', () => {
    expect(keys.length).toBeGreaterThanOrEqual(4);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('has a question and an answer sound for every item', () => {
    keys.forEach((key) => {
      expect(sounds[key.toUpperCase()]?.QUESTION).toBeDefined();
      expect(sounds[key.toUpperCase()]?.ANSWER).toBeDefined();
    });
  });

  it('has no sound left without an item', () => {
    const soundKeys = Object.keys(sounds).map((key) => key.toLowerCase());

    expect(soundKeys.sort()).toEqual([...keys].sort());
  });

  it('has a picture for every item', () => {
    keys.forEach((key) => {
      expect(PICTURES[gameType][key]).toBeDefined();
    });
  });
});

// Le jeu des suites dit sa propre réponse pour chaque animal et chaque forme.
describe('sequence answers', () => {
  const keys = [...QUESTION_CONFIGS.animal, ...QUESTION_CONFIGS.shape].map(
    (item) => item.key,
  );

  it('has an answer sound for every animal and shape, and no other', () => {
    expect(Object.keys(SOUNDS_SEQUENCE_ANSWER).sort()).toEqual(keys.sort());
  });
});
