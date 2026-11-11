let mockFiles: Record<string, string>;

jest.mock('expo-file-system', () => ({
  Paths: {document: 'document'},
  File: jest.fn((...parts: string[]) => {
    const path = parts.join('/');
    return {
      get exists() {
        return path in mockFiles;
      },
      textSync: () => mockFiles[path],
      write: (content: string) => {
        mockFiles[path] = content;
      },
    };
  }),
}));

jest.mock('@sentry/react-native', () => ({
  logger: {error: jest.fn(), warn: jest.fn()},
  captureException: jest.fn(),
}));

const REWARDS_FILE = 'document/nolice-rewards.json';
const SETTINGS_FILE = 'document/nolice-settings.json';

const rewards = () =>
  (require('./rewards') as typeof import('./rewards')).useRewardsStore;
const settings = () =>
  (require('./settings') as typeof import('./settings')).useSettingsStore;

beforeEach(() => {
  // Les stores lisent leur fichier au chargement du module : chaque test repart de modules neufs.
  jest.resetModules();
  mockFiles = {};
});

describe('claim', () => {
  it('wins the reward and keeps it across launches', () => {
    expect(rewards().getState().claim('game-1', 'number', 9)).toEqual({
      kind: 'mascot',
      key: 'sheep',
    });
    expect(rewards().getState().mascots).toEqual(['sheep']);

    jest.resetModules();

    expect(rewards().getState().mascots).toEqual(['sheep']);
  });

  it('gives a game its reward only once', () => {
    const first = rewards().getState().claim('game-1', 'shape', 9);
    const again = rewards().getState().claim('game-1', 'shape', 9);

    expect(again).toEqual(first);
    expect(rewards().getState()).toMatchObject({mascots: ['pig'], decors: []});
  });

  it('gives the next reward to the next game', () => {
    rewards().getState().claim('game-1', 'shape', 9);

    expect(rewards().getState().claim('game-2', 'shape', 9)).toEqual({
      kind: 'decor',
      key: 'banquise',
    });
    expect(rewards().getState().decors).toEqual(['banquise']);
  });

  it('wins a track and keeps it across launches', () => {
    rewards().getState().claim('game-1', 'number', 9);
    rewards().getState().claim('game-2', 'number', 9);

    jest.resetModules();

    expect(rewards().getState().tracks).toEqual(['aventure']);
  });

  it('wins nothing below 9', () => {
    expect(rewards().getState().claim('game-1', 'shape', 8)).toBeNull();
    expect(mockFiles[REWARDS_FILE]).toBeUndefined();
  });
});

describe('saved rewards', () => {
  it('ignores keys that are not rewards', () => {
    mockFiles[REWARDS_FILE] = JSON.stringify({
      mascots: ['sheep', 'owl', 'dragon'],
      decors: 'banquise',
      tracks: ['festive', 'calme'],
    });

    expect(rewards().getState()).toMatchObject({
      mascots: ['sheep'],
      decors: [],
      tracks: ['festive'],
    });
  });

  it('starts empty when the file is unreadable', () => {
    mockFiles[REWARDS_FILE] = '{not json';

    expect(rewards().getState()).toMatchObject({mascots: [], decors: []});
  });
});

// Les réglages s'appuient sur les récompenses gagnées pour écarter un choix verrouillé.
describe('saved settings', () => {
  it('fall back to the base mascot, decor and track when the saved ones are locked', () => {
    mockFiles[SETTINGS_FILE] = JSON.stringify({
      mascot: 'rabbit',
      decor: 'banquise',
      musicTrack: 'festive',
    });

    expect(settings().getState()).toMatchObject({
      mascot: 'owl',
      decor: 'nuages',
      musicTrack: 'joyeuse',
    });
  });

  it('keep a mascot, a decor and a track that were won', () => {
    mockFiles[REWARDS_FILE] = JSON.stringify({
      mascots: ['rabbit'],
      decors: ['banquise'],
      tracks: ['festive'],
    });
    mockFiles[SETTINGS_FILE] = JSON.stringify({
      mascot: 'rabbit',
      decor: 'banquise',
      musicTrack: 'festive',
    });

    expect(settings().getState()).toMatchObject({
      mascot: 'rabbit',
      decor: 'banquise',
      musicTrack: 'festive',
    });
  });

  it('remember that the welcome tour was followed', () => {
    expect(settings().getState().welcomed).toBe(false);

    settings().getState().setSetting('welcomed', true);
    jest.resetModules();

    expect(settings().getState().welcomed).toBe(true);
  });
});
