type Status = {playing?: boolean; didJustFinish?: boolean};

class MockPlayer {
  playing = false;
  loop = false;
  volume = 1;
  private listener: ((status: Status) => void) | null = null;
  private readonly pendingSeeks: (() => void)[] = [];

  play = jest.fn(() => {
    this.playing = true;
  });
  pause = jest.fn(() => {
    this.playing = false;
  });
  replace = jest.fn();
  seekTo = jest.fn(
    () =>
      new Promise<void>((resolve) => {
        this.pendingSeeks.push(resolve);
      }),
  );
  addListener = jest.fn(
    (_event: string, listener: (status: Status) => void) => {
      this.listener = listener;
    },
  );

  emit(status: Status) {
    this.listener?.(status);
  }

  finishSeek() {
    this.pendingSeeks.shift()?.();
  }
}

let mockPlayers: MockPlayer[] = [];
let mockLocalUri: (src: number) => string;

jest.mock('expo-audio', () => ({
  createAudioPlayer: jest.fn(() => {
    const player = new MockPlayer();
    mockPlayers.push(player);
    return player;
  }),
  setAudioModeAsync: jest.fn(async () => {}),
  preload: jest.fn(async () => {}),
}));

jest.mock('expo-asset', () => ({
  Asset: {
    fromModule: (src: number) => ({
      downloadAsync: async () => {},
      localUri: mockLocalUri(src),
    }),
  },
}));

jest.mock('expo-file-system', () => ({
  Paths: {cache: 'cache'},
  File: jest.fn((...parts: string[]) => ({
    exists: false,
    uri: `file:///${parts.join('/')}`,
    copy: jest.fn(),
  })),
}));

jest.mock('@sentry/react-native', () => ({
  logger: {error: jest.fn(), warn: jest.fn()},
  captureException: jest.fn(),
}));

const SOUND_A = 101;
const SOUND_B = 102;
const TRACK_A = 201;
const TRACK_B = 202;

let useSoundStore: typeof import('./audio').useSoundStore;
let expoAudio: jest.Mocked<typeof import('expo-audio')>;
let Sentry: jest.Mocked<typeof import('@sentry/react-native')>;

const store = () => useSoundStore.getState();
const player = () => mockPlayers[0];

// Lance un son et attend que le lecteur soit réellement parti.
async function start(src: number, callback?: () => void) {
  const pending = store().play(src, callback);
  player().finishSeek();
  await pending;
}

beforeEach(() => {
  // Le store garde son lecteur et son jeton dans des variables de module : chaque test repart d'un module neuf.
  jest.resetModules();
  jest.useFakeTimers();
  mockPlayers = [];
  mockLocalUri = (src) => `file:///assets/${src}.mp3`;
  useSoundStore = require('./audio').useSoundStore;
  expoAudio = require('expo-audio');
  Sentry = require('@sentry/react-native');
});

afterEach(() => {
  jest.useRealTimers();
});

describe('play', () => {
  it('starts the sound once the player is back at the beginning', async () => {
    const pending = store().play(SOUND_A);

    expect(expoAudio.createAudioPlayer).toHaveBeenCalledWith(SOUND_A);
    expect(player().seekTo).toHaveBeenCalledWith(0);
    expect(player().play).not.toHaveBeenCalled();

    player().finishSeek();
    await pending;

    expect(player().play).toHaveBeenCalledTimes(1);
  });

  it('reuses the same player for the next sound', async () => {
    await start(SOUND_A);
    await start(SOUND_B);

    expect(expoAudio.createAudioPlayer).toHaveBeenCalledTimes(1);
    expect(player().addListener).toHaveBeenCalledTimes(1);
    expect(player().replace).toHaveBeenCalledWith(SOUND_B);
    expect(player().pause.mock.invocationCallOrder[0]).toBeLessThan(
      player().replace.mock.invocationCallOrder[0],
    );
    expect(player().play).toHaveBeenCalledTimes(2);
  });

  it('runs the callback once when the sound finishes', async () => {
    const callback = jest.fn();
    await start(SOUND_A, callback);

    expect(callback).not.toHaveBeenCalled();

    player().emit({didJustFinish: true});
    player().emit({didJustFinish: true});

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('drops the callback of an interrupted sound', async () => {
    const interrupted = jest.fn();
    const latest = jest.fn();
    await start(SOUND_A, interrupted);
    await start(SOUND_B, latest);

    player().emit({didJustFinish: true});

    expect(interrupted).not.toHaveBeenCalled();
    expect(latest).toHaveBeenCalledTimes(1);
  });

  it('ignores a late finish of the previous sound', async () => {
    const previous = jest.fn();
    const latest = jest.fn();
    await start(SOUND_A, previous);

    const pending = store().play(SOUND_B, latest);
    player().emit({didJustFinish: true});
    player().finishSeek();
    await pending;

    expect(previous).not.toHaveBeenCalled();
    expect(latest).not.toHaveBeenCalled();

    player().emit({didJustFinish: true});

    expect(latest).toHaveBeenCalledTimes(1);
  });

  it('lets the latest of two overlapping sounds win', async () => {
    const first = jest.fn();
    const latest = jest.fn();
    const pendingFirst = store().play(SOUND_A, first);
    const pendingLatest = store().play(SOUND_B, latest);

    player().finishSeek();
    player().finishSeek();
    await Promise.all([pendingFirst, pendingLatest]);
    player().emit({didJustFinish: true});

    expect(player().play).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
    expect(latest).toHaveBeenCalledTimes(1);
  });

  it('reports a player failure and releases the loading flag', async () => {
    expoAudio.createAudioPlayer.mockImplementationOnce(() => {
      throw new Error('no player');
    });

    await store().play(SOUND_A);

    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
    expect(store().audioLoading).toBe(false);
  });
});

describe('audioLoading', () => {
  it('stays on until the player reports it is playing', async () => {
    await start(SOUND_A);

    expect(store().audioLoading).toBe(true);

    player().emit({playing: true});

    expect(store().audioLoading).toBe(false);
  });

  it('turns off after 2 seconds if the player never reports', async () => {
    await start(SOUND_A);

    jest.advanceTimersByTime(1999);
    expect(store().audioLoading).toBe(true);

    jest.advanceTimersByTime(1);
    expect(store().audioLoading).toBe(false);
  });

  it('gives each sound its own 2 seconds', async () => {
    await start(SOUND_A);
    jest.advanceTimersByTime(1500);
    await start(SOUND_B);

    jest.advanceTimersByTime(1000);
    expect(store().audioLoading).toBe(true);

    jest.advanceTimersByTime(1000);
    expect(store().audioLoading).toBe(false);
  });
});

describe('stop', () => {
  it('cancels a sound that has not started yet', async () => {
    const callback = jest.fn();
    const pending = store().play(SOUND_A, callback);

    store().stop();
    player().finishSeek();
    await pending;
    player().emit({didJustFinish: true});

    expect(player().play).not.toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
    expect(store().audioLoading).toBe(false);
  });

  it('pauses the current sound and drops its callback', async () => {
    const callback = jest.fn();
    await start(SOUND_A, callback);

    store().stop();
    player().emit({didJustFinish: true});

    expect(player().pause).toHaveBeenCalledTimes(1);
    expect(callback).not.toHaveBeenCalled();
    expect(store().audioLoading).toBe(false);
  });

  it('does nothing before the first sound', () => {
    expect(() => {
      store().stop();
    }).not.toThrow();
    expect(mockPlayers).toHaveLength(0);
  });
});

describe('replay', () => {
  it('restarts the current sound without reloading it', async () => {
    await start(SOUND_A);

    const pending = store().replay();
    player().finishSeek();
    await pending;

    expect(player().replace).not.toHaveBeenCalled();
    expect(player().seekTo).toHaveBeenCalledTimes(2);
    expect(player().play).toHaveBeenCalledTimes(2);
  });

  it('does nothing before the first sound', async () => {
    await store().replay();

    expect(mockPlayers).toHaveLength(0);
  });
});

describe('playBackground', () => {
  it('starts a looping track at low volume', async () => {
    await store().playBackground(TRACK_A);

    expect(expoAudio.createAudioPlayer).toHaveBeenCalledWith(TRACK_A);
    expect(player().loop).toBe(true);
    expect(player().volume).toBe(0.2);
    expect(player().play).toHaveBeenCalledTimes(1);
    expect(store().backgroundLoaded).toBe(true);
    expect(store().backgroundPlaying).toBe(true);
  });

  it('leaves the track alone when asked for it again', async () => {
    await store().playBackground(TRACK_A);
    await store().playBackground(TRACK_A);

    expect(expoAudio.createAudioPlayer).toHaveBeenCalledTimes(1);
    expect(player().replace).not.toHaveBeenCalled();
    expect(player().play).toHaveBeenCalledTimes(1);
  });

  it('swaps the track and keeps the music on', async () => {
    await store().playBackground(TRACK_A);
    await store().playBackground(TRACK_B);

    expect(expoAudio.createAudioPlayer).toHaveBeenCalledTimes(1);
    expect(player().replace).toHaveBeenCalledWith(TRACK_B);
    expect(player().play).toHaveBeenCalledTimes(2);
    expect(store().backgroundPlaying).toBe(true);
  });

  it('swaps the track silently when the music is off', async () => {
    await store().playBackground(TRACK_A);
    store().toggleBackground();
    await store().playBackground(TRACK_B);

    expect(player().replace).toHaveBeenCalledWith(TRACK_B);
    expect(player().play).toHaveBeenCalledTimes(1);
    expect(store().backgroundPlaying).toBe(false);
  });

  it('still reports the music as loaded when the player fails', async () => {
    expoAudio.createAudioPlayer.mockImplementationOnce(() => {
      throw new Error('no player');
    });

    await store().playBackground(TRACK_A);

    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
    expect(store().backgroundLoaded).toBe(true);
    expect(store().backgroundPlaying).toBe(false);
  });
});

describe('toggleBackground', () => {
  it('turns the music off, then on again', async () => {
    await store().playBackground(TRACK_A);

    expect(store().toggleBackground()).toBe(false);
    expect(player().pause).toHaveBeenCalledTimes(1);
    expect(store().backgroundPlaying).toBe(false);

    expect(store().toggleBackground()).toBe(true);
    expect(player().play).toHaveBeenCalledTimes(2);
    expect(store().backgroundPlaying).toBe(true);
  });

  it('restarts music the system paused on its own', async () => {
    await store().playBackground(TRACK_A);
    player().playing = false;

    expect(store().toggleBackground()).toBe(true);
    expect(player().pause).not.toHaveBeenCalled();
    expect(player().play).toHaveBeenCalledTimes(2);
    expect(store().backgroundPlaying).toBe(true);
  });
});

describe('preloadAllAssets', () => {
  it('preloads the game sounds from file paths, then plays them from there', async () => {
    await store().preloadAllAssets();

    expect(expoAudio.setAudioModeAsync).toHaveBeenCalledWith({
      interruptionMode: 'doNotMix',
    });
    expect(expoAudio.preload.mock.calls.length).toBeGreaterThan(70);
    expoAudio.preload.mock.calls.forEach(([source]) => {
      expect(source).toEqual({uri: 'file:///assets/1.mp3'});
    });
    expect(store().assetsLoaded).toBe(true);

    await start(1);

    expect(expoAudio.createAudioPlayer).toHaveBeenCalledWith({
      uri: 'file:///assets/1.mp3',
    });
  });

  it('copies a sound to the cache when it has no file path', async () => {
    mockLocalUri = (src) => `asset:/audio_${src}`;

    await store().preloadAllAssets();

    expect(expoAudio.preload).toHaveBeenCalledWith({
      uri: 'file:///cache/preload-1.mp3',
    });
    expect(store().assetsLoaded).toBe(true);
  });

  it('finishes loading even when sounds cannot be preloaded', async () => {
    expoAudio.preload.mockRejectedValue(new Error('unreadable'));

    await store().preloadAllAssets();

    expect(Sentry.captureException).toHaveBeenCalled();
    expect(store().assetsLoaded).toBe(true);
  });
});
