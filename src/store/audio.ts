import * as Sentry from '@sentry/react-native';
import {Asset} from 'expo-asset';
import {
  AudioSource,
  createAudioPlayer,
  AudioPlayer,
  setAudioModeAsync,
  preload,
} from 'expo-audio';
import {File, Paths} from 'expo-file-system';
import {create} from 'zustand';

import type {MusicTrackKey} from './settings';
import type {GameKey} from '../utils/color';
import type {Reward, Unlock} from '../utils/rewards';

interface AudioStoreState {
  backgroundPlaying: boolean;
  backgroundLoaded: boolean;
  currentPlayer: AudioPlayer | null;
  audioLoading: boolean;
  assetsLoaded: boolean;
  toggleBackground: () => boolean;
  playBackground: (src: AudioSource) => Promise<void>;
  startBackground: (src: AudioSource) => Promise<void>;
  play: (src: AudioSource, callback?: () => void) => Promise<void>;
  replay: () => Promise<void>;
  stop: () => void;
  preloadAllAssets: () => Promise<void>;
}

const DOMMAGE_SOUND_PATH = '../../assets/audio/dommage.mp3';
const BRAVO_SOUND_PATH = '../../assets/audio/bravo.mp3';
const COUNT_DUCK_SOUND_PATH = '../../assets/audio/count-duck.mp3';
const COUNT_CAT_SOUND_PATH = '../../assets/audio/count-cat.mp3';
const COUNT_DOG_SOUND_PATH = '../../assets/audio/count-dog.mp3';
const COUNT_PIG_SOUND_PATH = '../../assets/audio/count-pig.mp3';
const COUNT_COW_SOUND_PATH = '../../assets/audio/count-cow.mp3';
const COUNT_RABBIT_SOUND_PATH = '../../assets/audio/count-rabbit.mp3';
const COUNT_BIRD_SOUND_PATH = '../../assets/audio/count-bird.mp3';
const COUNT_SHEEP_SOUND_PATH = '../../assets/audio/count-sheep.mp3';
const COUNT_OWL_SOUND_PATH = '../../assets/audio/count-owl.mp3';
const DUCK_QUESTION_SOUND_PATH = '../../assets/audio/duck.mp3';
const DUCK_ANSWER_SOUND_PATH = '../../assets/audio/response-duck.mp3';
const CAT_QUESTION_SOUND_PATH = '../../assets/audio/cat.mp3';
const CAT_ANSWER_SOUND_PATH = '../../assets/audio/response-cat.mp3';
const DOG_QUESTION_SOUND_PATH = '../../assets/audio/dog.mp3';
const DOG_ANSWER_SOUND_PATH = '../../assets/audio/response-dog.mp3';
const PIG_QUESTION_SOUND_PATH = '../../assets/audio/pig.mp3';
const PIG_ANSWER_SOUND_PATH = '../../assets/audio/response-pig.mp3';
const COW_QUESTION_SOUND_PATH = '../../assets/audio/cow.mp3';
const COW_ANSWER_SOUND_PATH = '../../assets/audio/response-cow.mp3';
const RABBIT_QUESTION_SOUND_PATH = '../../assets/audio/rabbit.mp3';
const RABBIT_ANSWER_SOUND_PATH = '../../assets/audio/response-rabbit.mp3';
const BIRD_QUESTION_SOUND_PATH = '../../assets/audio/bird.mp3';
const BIRD_ANSWER_SOUND_PATH = '../../assets/audio/response-bird.mp3';
const SHEEP_QUESTION_SOUND_PATH = '../../assets/audio/sheep.mp3';
const SHEEP_ANSWER_SOUND_PATH = '../../assets/audio/response-sheep.mp3';
const OWL_QUESTION_SOUND_PATH = '../../assets/audio/owl.mp3';
const OWL_ANSWER_SOUND_PATH = '../../assets/audio/response-owl.mp3';
const CIRCLE_QUESTION_SOUND_PATH = '../../assets/audio/shape-circle.mp3';
const CIRCLE_ANSWER_SOUND_PATH = '../../assets/audio/response-circle.mp3';
const CROSS_QUESTION_SOUND_PATH = '../../assets/audio/shape-cross.mp3';
const CROSS_ANSWER_SOUND_PATH = '../../assets/audio/response-cross.mp3';
const HEART_QUESTION_SOUND_PATH = '../../assets/audio/shape-heart.mp3';
const HEART_ANSWER_SOUND_PATH = '../../assets/audio/response-heart.mp3';
const LOSANGE_QUESTION_SOUND_PATH = '../../assets/audio/shape-losange.mp3';
const LOSANGE_ANSWER_SOUND_PATH = '../../assets/audio/response-losange.mp3';
const OVAL_QUESTION_SOUND_PATH = '../../assets/audio/shape-oval.mp3';
const OVAL_ANSWER_SOUND_PATH = '../../assets/audio/response-oval.mp3';
const RECTANGLE_QUESTION_SOUND_PATH = '../../assets/audio/shape-rectangle.mp3';
const RECTANGLE_ANSWER_SOUND_PATH = '../../assets/audio/response-rectangle.mp3';
const SQUARE_QUESTION_SOUND_PATH = '../../assets/audio/shape-square.mp3';
const SQUARE_ANSWER_SOUND_PATH = '../../assets/audio/response-square.mp3';
const STAR_QUESTION_SOUND_PATH = '../../assets/audio/shape-star.mp3';
const STAR_ANSWER_SOUND_PATH = '../../assets/audio/response-star.mp3';
const TRIANGLE_QUESTION_SOUND_PATH = '../../assets/audio/shape-triangle.mp3';
const TRIANGLE_ANSWER_SOUND_PATH = '../../assets/audio/response-triangle.mp3';
const BLACK_QUESTION_SOUND_PATH = '../../assets/audio/black.mp3';
const BLACK_ANSWER_SOUND_PATH = '../../assets/audio/response-black.mp3';
const BLUE_QUESTION_SOUND_PATH = '../../assets/audio/blue.mp3';
const BLUE_ANSWER_SOUND_PATH = '../../assets/audio/response-blue.mp3';
const BROWN_QUESTION_SOUND_PATH = '../../assets/audio/brown.mp3';
const BROWN_ANSWER_SOUND_PATH = '../../assets/audio/response-brown.mp3';
const GREEN_QUESTION_SOUND_PATH = '../../assets/audio/green.mp3';
const GREEN_ANSWER_SOUND_PATH = '../../assets/audio/response-green.mp3';
const PINK_QUESTION_SOUND_PATH = '../../assets/audio/pink.mp3';
const PINK_ANSWER_SOUND_PATH = '../../assets/audio/response-pink.mp3';
const PURPLE_QUESTION_SOUND_PATH = '../../assets/audio/purple.mp3';
const PURPLE_ANSWER_SOUND_PATH = '../../assets/audio/response-purple.mp3';
const RED_QUESTION_SOUND_PATH = '../../assets/audio/red.mp3';
const RED_ANSWER_SOUND_PATH = '../../assets/audio/response-red.mp3';
const YELLOW_QUESTION_SOUND_PATH = '../../assets/audio/yellow.mp3';
const YELLOW_ANSWER_SOUND_PATH = '../../assets/audio/response-yellow.mp3';
const ORANGE_QUESTION_SOUND_PATH = '../../assets/audio/orange.mp3';
const ORANGE_ANSWER_SOUND_PATH = '../../assets/audio/response-orange.mp3';
const GREY_QUESTION_SOUND_PATH = '../../assets/audio/grey.mp3';
const GREY_ANSWER_SOUND_PATH = '../../assets/audio/response-grey.mp3';
const CONGRATULATION_SOUND_PATH = '../../assets/audio/congratulation.mp3';
const ALMOST_SOUND_PATH = '../../assets/audio/score-almost.mp3';
const PERFECT_SOUND_PATH = '../../assets/audio/score-perfect.mp3';
const RETRY_SOUND_PATH = '../../assets/audio/retry.mp3';
const JOYEUSE_MUSIC_PATH = '../../assets/audio/joyeux.mp3';
const CALME_MUSIC_PATH = '../../assets/audio/calme.mp3';
const AVENTURE_MUSIC_PATH = '../../assets/audio/aventure.mp3';
const FESTIVE_MUSIC_PATH = '../../assets/audio/festive.mp3';
const ANSWER_ONE_SOUND_PATH = '../../assets/audio/response-one.mp3';
const ANSWER_TWO_SOUND_PATH = '../../assets/audio/response-two.mp3';
const ANSWER_THREE_SOUND_PATH = '../../assets/audio/response-three.mp3';
const ANSWER_FOUR_SOUND_PATH = '../../assets/audio/response-four.mp3';
const ANSWER_FIVE_SOUND_PATH = '../../assets/audio/response-five.mp3';
const ANSWER_SIX_SOUND_PATH = '../../assets/audio/response-six.mp3';
const ANSWER_SEVEN_SOUND_PATH = '../../assets/audio/response-seven.mp3';
const ANSWER_EIGHT_SOUND_PATH = '../../assets/audio/response-eight.mp3';
const ANSWER_NINE_SOUND_PATH = '../../assets/audio/response-nine.mp3';
const UNLOCK_NUMBER_SOUND_PATH = '../../assets/audio/unlock-number.mp3';
const UNLOCK_NUMBER_TWICE_SOUND_PATH =
  '../../assets/audio/unlock-number-twice.mp3';
const UNLOCK_ANIMAL_SOUND_PATH = '../../assets/audio/unlock-animal.mp3';
const UNLOCK_ANIMAL_TWICE_SOUND_PATH =
  '../../assets/audio/unlock-animal-twice.mp3';
const UNLOCK_COLOR_SOUND_PATH = '../../assets/audio/unlock-color.mp3';
const UNLOCK_COLOR_TWICE_SOUND_PATH =
  '../../assets/audio/unlock-color-twice.mp3';
const UNLOCK_SHAPE_SOUND_PATH = '../../assets/audio/unlock-shape.mp3';
const UNLOCK_SHAPE_TWICE_SOUND_PATH =
  '../../assets/audio/unlock-shape-twice.mp3';
const UNLOCK_LETTER_SOUND_PATH = '../../assets/audio/unlock-letter.mp3';
const UNLOCK_LETTER_TWICE_SOUND_PATH =
  '../../assets/audio/unlock-letter-twice.mp3';
const UNLOCK_PERFECT_SOUND_PATH = '../../assets/audio/unlock-perfect.mp3';
const WELCOME_MASCOT_SOUND_PATH = '../../assets/audio/welcome-mascot.mp3';
const WELCOME_DECOR_SOUND_PATH = '../../assets/audio/welcome-decor.mp3';
const WELCOME_TRACK_SOUND_PATH = '../../assets/audio/welcome-track.mp3';
const REWARD_MASCOT_SOUND_PATH = '../../assets/audio/reward-mascot.mp3';
const REWARD_DECOR_SOUND_PATH = '../../assets/audio/reward-decor.mp3';
const REWARD_TRACK_SOUND_PATH = '../../assets/audio/reward-track.mp3';

type SoundsTypeQuestion = {
  [gameType: string]: SoundQuestionType;
};

export interface SoundQuestionType {
  [key: string]: {
    QUESTION: AudioSource;
    ANSWER: AudioSource;
  };
}

type SoundsType = {
  DOMMAGE: AudioSource;
  RETRY: AudioSource;
  BRAVO: AudioSource;
  CONGRATULATION: AudioSource;
  ALMOST: AudioSource;
  PERFECT: AudioSource;
};

export const SOUNDS: SoundsType = {
  DOMMAGE: require(DOMMAGE_SOUND_PATH),
  RETRY: require(RETRY_SOUND_PATH),
  BRAVO: require(BRAVO_SOUND_PATH),
  CONGRATULATION: require(CONGRATULATION_SOUND_PATH),
  ALMOST: require(ALMOST_SOUND_PATH),
  PERFECT: require(PERFECT_SOUND_PATH),
};

export const MUSIC_TRACKS: Record<MusicTrackKey, AudioSource> = {
  joyeuse: require(JOYEUSE_MUSIC_PATH),
  calme: require(CALME_MUSIC_PATH),
  aventure: require(AVENTURE_MUSIC_PATH),
  festive: require(FESTIVE_MUSIC_PATH),
};

const SOUNDS_UNLOCK: Record<GameKey, Record<1 | 2, AudioSource>> = {
  number: {
    1: require(UNLOCK_NUMBER_SOUND_PATH),
    2: require(UNLOCK_NUMBER_TWICE_SOUND_PATH),
  },
  animal: {
    1: require(UNLOCK_ANIMAL_SOUND_PATH),
    2: require(UNLOCK_ANIMAL_TWICE_SOUND_PATH),
  },
  color: {
    1: require(UNLOCK_COLOR_SOUND_PATH),
    2: require(UNLOCK_COLOR_TWICE_SOUND_PATH),
  },
  shape: {
    1: require(UNLOCK_SHAPE_SOUND_PATH),
    2: require(UNLOCK_SHAPE_TWICE_SOUND_PATH),
  },
  letter: {
    1: require(UNLOCK_LETTER_SOUND_PATH),
    2: require(UNLOCK_LETTER_TWICE_SOUND_PATH),
  },
};
const UNLOCK_PERFECT_SOUND: AudioSource = require(UNLOCK_PERFECT_SOUND_PATH);

// La phrase qui dit comment gagner une récompense encore verrouillée.
export function unlockSound(unlock: Unlock): AudioSource {
  return unlock === 'perfect'
    ? UNLOCK_PERFECT_SOUND
    : SOUNDS_UNLOCK[unlock.game][unlock.successes];
}

export const SOUNDS_WELCOME = {
  MASCOT: require(WELCOME_MASCOT_SOUND_PATH) as AudioSource,
  DECOR: require(WELCOME_DECOR_SOUND_PATH) as AudioSource,
  TRACK: require(WELCOME_TRACK_SOUND_PATH) as AudioSource,
};

export const SOUNDS_REWARD: Record<Reward['kind'], AudioSource> = {
  mascot: require(REWARD_MASCOT_SOUND_PATH),
  decor: require(REWARD_DECOR_SOUND_PATH),
  track: require(REWARD_TRACK_SOUND_PATH),
};

export interface SoundCountType {
  [key: string]: AudioSource;
}
export const SOUNDS_COUNT_QUESTION: SoundCountType = {
  DUCK: require(COUNT_DUCK_SOUND_PATH),
  CAT: require(COUNT_CAT_SOUND_PATH),
  DOG: require(COUNT_DOG_SOUND_PATH),
  PIG: require(COUNT_PIG_SOUND_PATH),
  COW: require(COUNT_COW_SOUND_PATH),
  RABBIT: require(COUNT_RABBIT_SOUND_PATH),
  BIRD: require(COUNT_BIRD_SOUND_PATH),
  SHEEP: require(COUNT_SHEEP_SOUND_PATH),
  OWL: require(COUNT_OWL_SOUND_PATH),
  ONE: require(ANSWER_ONE_SOUND_PATH),
  TWO: require(ANSWER_TWO_SOUND_PATH),
  THREE: require(ANSWER_THREE_SOUND_PATH),
  FOUR: require(ANSWER_FOUR_SOUND_PATH),
  FIVE: require(ANSWER_FIVE_SOUND_PATH),
  SIX: require(ANSWER_SIX_SOUND_PATH),
  SEVEN: require(ANSWER_SEVEN_SOUND_PATH),
  EIGHT: require(ANSWER_EIGHT_SOUND_PATH),
  NINE: require(ANSWER_NINE_SOUND_PATH),
};

export const SOUNDS_QUESTION: SoundsTypeQuestion = {
  COLOR: {
    YELLOW: {
      QUESTION: require(YELLOW_QUESTION_SOUND_PATH),
      ANSWER: require(YELLOW_ANSWER_SOUND_PATH),
    },
    RED: {
      QUESTION: require(RED_QUESTION_SOUND_PATH),
      ANSWER: require(RED_ANSWER_SOUND_PATH),
    },
    BROWN: {
      QUESTION: require(BROWN_QUESTION_SOUND_PATH),
      ANSWER: require(BROWN_ANSWER_SOUND_PATH),
    },
    BLUE: {
      QUESTION: require(BLUE_QUESTION_SOUND_PATH),
      ANSWER: require(BLUE_ANSWER_SOUND_PATH),
    },
    PINK: {
      QUESTION: require(PINK_QUESTION_SOUND_PATH),
      ANSWER: require(PINK_ANSWER_SOUND_PATH),
    },
    GREEN: {
      QUESTION: require(GREEN_QUESTION_SOUND_PATH),
      ANSWER: require(GREEN_ANSWER_SOUND_PATH),
    },
    BLACK: {
      QUESTION: require(BLACK_QUESTION_SOUND_PATH),
      ANSWER: require(BLACK_ANSWER_SOUND_PATH),
    },
    PURPLE: {
      QUESTION: require(PURPLE_QUESTION_SOUND_PATH),
      ANSWER: require(PURPLE_ANSWER_SOUND_PATH),
    },
    ORANGE: {
      QUESTION: require(ORANGE_QUESTION_SOUND_PATH),
      ANSWER: require(ORANGE_ANSWER_SOUND_PATH),
    },
    GREY: {
      QUESTION: require(GREY_QUESTION_SOUND_PATH),
      ANSWER: require(GREY_ANSWER_SOUND_PATH),
    },
  },
  ANIMAL: {
    BIRD: {
      QUESTION: require(BIRD_QUESTION_SOUND_PATH),
      ANSWER: require(BIRD_ANSWER_SOUND_PATH),
    },
    CAT: {
      QUESTION: require(CAT_QUESTION_SOUND_PATH),
      ANSWER: require(CAT_ANSWER_SOUND_PATH),
    },
    DOG: {
      QUESTION: require(DOG_QUESTION_SOUND_PATH),
      ANSWER: require(DOG_ANSWER_SOUND_PATH),
    },
    DUCK: {
      QUESTION: require(DUCK_QUESTION_SOUND_PATH),
      ANSWER: require(DUCK_ANSWER_SOUND_PATH),
    },
    PIG: {
      QUESTION: require(PIG_QUESTION_SOUND_PATH),
      ANSWER: require(PIG_ANSWER_SOUND_PATH),
    },
    COW: {
      QUESTION: require(COW_QUESTION_SOUND_PATH),
      ANSWER: require(COW_ANSWER_SOUND_PATH),
    },
    RABBIT: {
      QUESTION: require(RABBIT_QUESTION_SOUND_PATH),
      ANSWER: require(RABBIT_ANSWER_SOUND_PATH),
    },
    SHEEP: {
      QUESTION: require(SHEEP_QUESTION_SOUND_PATH),
      ANSWER: require(SHEEP_ANSWER_SOUND_PATH),
    },
    OWL: {
      QUESTION: require(OWL_QUESTION_SOUND_PATH),
      ANSWER: require(OWL_ANSWER_SOUND_PATH),
    },
  },
  SHAPE: {
    CIRCLE: {
      QUESTION: require(CIRCLE_QUESTION_SOUND_PATH),
      ANSWER: require(CIRCLE_ANSWER_SOUND_PATH),
    },
    CROSS: {
      QUESTION: require(CROSS_QUESTION_SOUND_PATH),
      ANSWER: require(CROSS_ANSWER_SOUND_PATH),
    },
    HEART: {
      QUESTION: require(HEART_QUESTION_SOUND_PATH),
      ANSWER: require(HEART_ANSWER_SOUND_PATH),
    },
    LOSANGE: {
      QUESTION: require(LOSANGE_QUESTION_SOUND_PATH),
      ANSWER: require(LOSANGE_ANSWER_SOUND_PATH),
    },
    OVAL: {
      QUESTION: require(OVAL_QUESTION_SOUND_PATH),
      ANSWER: require(OVAL_ANSWER_SOUND_PATH),
    },
    RECTANGLE: {
      QUESTION: require(RECTANGLE_QUESTION_SOUND_PATH),
      ANSWER: require(RECTANGLE_ANSWER_SOUND_PATH),
    },
    SQUARE: {
      QUESTION: require(SQUARE_QUESTION_SOUND_PATH),
      ANSWER: require(SQUARE_ANSWER_SOUND_PATH),
    },
    STAR: {
      QUESTION: require(STAR_QUESTION_SOUND_PATH),
      ANSWER: require(STAR_ANSWER_SOUND_PATH),
    },
    TRIANGLE: {
      QUESTION: require(TRIANGLE_QUESTION_SOUND_PATH),
      ANSWER: require(TRIANGLE_ANSWER_SOUND_PATH),
    },
  },
  LETTER: {
    A: {
      QUESTION: require('../../assets/audio/letter-a.mp3'),
      ANSWER: require('../../assets/audio/response-letter-a.mp3'),
    },
    B: {
      QUESTION: require('../../assets/audio/letter-b.mp3'),
      ANSWER: require('../../assets/audio/response-letter-b.mp3'),
    },
    C: {
      QUESTION: require('../../assets/audio/letter-c.mp3'),
      ANSWER: require('../../assets/audio/response-letter-c.mp3'),
    },
    D: {
      QUESTION: require('../../assets/audio/letter-d.mp3'),
      ANSWER: require('../../assets/audio/response-letter-d.mp3'),
    },
    E: {
      QUESTION: require('../../assets/audio/letter-e.mp3'),
      ANSWER: require('../../assets/audio/response-letter-e.mp3'),
    },
    F: {
      QUESTION: require('../../assets/audio/letter-f.mp3'),
      ANSWER: require('../../assets/audio/response-letter-f.mp3'),
    },
    G: {
      QUESTION: require('../../assets/audio/letter-g.mp3'),
      ANSWER: require('../../assets/audio/response-letter-g.mp3'),
    },
    H: {
      QUESTION: require('../../assets/audio/letter-h.mp3'),
      ANSWER: require('../../assets/audio/response-letter-h.mp3'),
    },
    I: {
      QUESTION: require('../../assets/audio/letter-i.mp3'),
      ANSWER: require('../../assets/audio/response-letter-i.mp3'),
    },
    J: {
      QUESTION: require('../../assets/audio/letter-j.mp3'),
      ANSWER: require('../../assets/audio/response-letter-j.mp3'),
    },
    K: {
      QUESTION: require('../../assets/audio/letter-k.mp3'),
      ANSWER: require('../../assets/audio/response-letter-k.mp3'),
    },
    L: {
      QUESTION: require('../../assets/audio/letter-l.mp3'),
      ANSWER: require('../../assets/audio/response-letter-l.mp3'),
    },
    M: {
      QUESTION: require('../../assets/audio/letter-m.mp3'),
      ANSWER: require('../../assets/audio/response-letter-m.mp3'),
    },
    N: {
      QUESTION: require('../../assets/audio/letter-n.mp3'),
      ANSWER: require('../../assets/audio/response-letter-n.mp3'),
    },
    O: {
      QUESTION: require('../../assets/audio/letter-o.mp3'),
      ANSWER: require('../../assets/audio/response-letter-o.mp3'),
    },
    P: {
      QUESTION: require('../../assets/audio/letter-p.mp3'),
      ANSWER: require('../../assets/audio/response-letter-p.mp3'),
    },
    Q: {
      QUESTION: require('../../assets/audio/letter-q.mp3'),
      ANSWER: require('../../assets/audio/response-letter-q.mp3'),
    },
    R: {
      QUESTION: require('../../assets/audio/letter-r.mp3'),
      ANSWER: require('../../assets/audio/response-letter-r.mp3'),
    },
    S: {
      QUESTION: require('../../assets/audio/letter-s.mp3'),
      ANSWER: require('../../assets/audio/response-letter-s.mp3'),
    },
    T: {
      QUESTION: require('../../assets/audio/letter-t.mp3'),
      ANSWER: require('../../assets/audio/response-letter-t.mp3'),
    },
    U: {
      QUESTION: require('../../assets/audio/letter-u.mp3'),
      ANSWER: require('../../assets/audio/response-letter-u.mp3'),
    },
    V: {
      QUESTION: require('../../assets/audio/letter-v.mp3'),
      ANSWER: require('../../assets/audio/response-letter-v.mp3'),
    },
    W: {
      QUESTION: require('../../assets/audio/letter-w.mp3'),
      ANSWER: require('../../assets/audio/response-letter-w.mp3'),
    },
    X: {
      QUESTION: require('../../assets/audio/letter-x.mp3'),
      ANSWER: require('../../assets/audio/response-letter-x.mp3'),
    },
    Y: {
      QUESTION: require('../../assets/audio/letter-y.mp3'),
      ANSWER: require('../../assets/audio/response-letter-y.mp3'),
    },
    Z: {
      QUESTION: require('../../assets/audio/letter-z.mp3'),
      ANSWER: require('../../assets/audio/response-letter-z.mp3'),
    },
  },
};

function errorSafe(callback: () => void, message: string) {
  try {
    callback();
  } catch (error: any) {
    Sentry.logger.error(message, {error: error?.message ?? String(error)});
    Sentry.captureException(error);
  }
}

let backgroundPlayer: AudioPlayer | null = null;
let backgroundSource: AudioSource | null = null;
let foregroundPlayer: AudioPlayer | null = null;
let foregroundCallback: (() => void) | null = null;
let foregroundCallbackFired = false;
let playToken = 0;

const MUSIC_VOLUME = 0.2;
const DUCKED_MUSIC_VOLUME = 0.06;
let musicDucked = false;

// La musique s'efface pendant une consigne, pour que la voix reste nette.
function duckMusic(ducked: boolean) {
  musicDucked = ducked;
  try {
    if (backgroundPlayer) {
      backgroundPlayer.volume = ducked ? DUCKED_MUSIC_VOLUME : MUSIC_VOLUME;
    }
  } catch {}
}

const resolvedUris = new Map<number, string>();

function resolveSource(src: AudioSource): AudioSource {
  if (typeof src === 'number') {
    const uri = resolvedUris.get(src);
    if (uri) return {uri};
  }
  return src;
}

async function resolveAssetToFile(src: number): Promise<string | null> {
  const asset = Asset.fromModule(src);
  await asset.downloadAsync();
  const localUri = asset.localUri;
  if (!localUri) {
    Sentry.logger.warn('Audio: localUri missing after downloadAsync', {
      src: String(src),
      assetUri: asset.uri ?? 'null',
    });
    return null;
  }
  if (localUri.startsWith('file://')) {
    return localUri;
  }
  const dest = new File(Paths.cache, `preload-${src}.mp3`);
  try {
    if (!dest.exists) {
      const source = new File(localUri);
      source.copy(dest);
    }
    return dest.uri;
  } catch (copyErr: any) {
    Sentry.logger.error('Audio error: copy asset to cache', {
      src: String(src),
      localUri,
      dest: dest.uri,
      error: copyErr?.message ?? String(copyErr),
    });
    Sentry.captureException(copyErr);
    return null;
  }
}

export const useSoundStore = create<AudioStoreState>((set, get) => ({
  backgroundPlaying: false,
  backgroundLoaded: false,
  currentPlayer: null,
  audioLoading: false,
  assetsLoaded: false,
  preloadAllAssets: async () => {
    try {
      await setAudioModeAsync({interruptionMode: 'doNotMix'});
    } catch (err: any) {
      Sentry.logger.error('Audio error: setAudioModeAsync at boot', {
        error: err?.message ?? String(err),
      });
      Sentry.captureException(err);
    }
    const sources: AudioSource[] = [
      SOUNDS.BRAVO,
      SOUNDS.DOMMAGE,
      SOUNDS.CONGRATULATION,
      SOUNDS.ALMOST,
      SOUNDS.PERFECT,
      SOUNDS.RETRY,
      ...Object.values(SOUNDS_COUNT_QUESTION),
      UNLOCK_PERFECT_SOUND,
      ...Object.values(SOUNDS_WELCOME),
      ...Object.values(SOUNDS_REWARD),
      ...Object.values(SOUNDS_UNLOCK).flatMap((sounds) =>
        Object.values(sounds),
      ),
    ];
    for (const gameType of Object.keys(SOUNDS_QUESTION)) {
      for (const key of Object.keys(SOUNDS_QUESTION[gameType])) {
        sources.push(SOUNDS_QUESTION[gameType][key].QUESTION);
        sources.push(SOUNDS_QUESTION[gameType][key].ANSWER);
      }
    }
    await Promise.all(
      sources.map(async (src) => {
        if (typeof src !== 'number') return;
        let filePath: string | null = null;
        try {
          filePath = await resolveAssetToFile(src);
          if (!filePath) return;
          resolvedUris.set(src, filePath);
          await preload({uri: filePath});
        } catch (err: any) {
          Sentry.logger.error('Audio error: preload asset', {
            src: String(src),
            filePath: filePath ?? 'null',
            error: err?.message ?? String(err),
          });
          Sentry.captureException(err);
        }
      }),
    );
    set({assetsLoaded: true});
  },
  play: async (src: AudioSource, callback?: () => void) => {
    const token = ++playToken;
    foregroundCallback = null;
    foregroundCallbackFired = false;
    set({audioLoading: true});

    try {
      const resolved = resolveSource(src);

      if (!foregroundPlayer) {
        foregroundPlayer = createAudioPlayer(resolved);
        set({currentPlayer: foregroundPlayer});

        foregroundPlayer.addListener('playbackStatusUpdate', (status) => {
          if (status.playing && get().audioLoading) {
            set({audioLoading: false});
          }
          if (status.didJustFinish) {
            if (get().audioLoading) {
              set({audioLoading: false});
            }
            const token = playToken;
            if (!foregroundCallbackFired && foregroundCallback) {
              foregroundCallbackFired = true;
              const cb = foregroundCallback;
              foregroundCallback = null;
              cb();
            }
            // Si le callback a enchaîné sur un autre son, la musique reste baissée.
            if (token === playToken) duckMusic(false);
          }
        });
      } else {
        try {
          foregroundPlayer.pause();
        } catch {}
        foregroundPlayer.replace(resolved);
      }

      setTimeout(() => {
        if (token === playToken && get().audioLoading) {
          set({audioLoading: false});
        }
      }, 2000);

      await foregroundPlayer.seekTo(0);
      // Un stop() ou un play() plus récent pendant le seekTo l'emporte.
      if (token !== playToken) return;
      // Armé seulement ici : un didJustFinish tardif du son précédent arrive avant la fin du seekTo.
      foregroundCallback = callback ?? null;
      duckMusic(true);
      foregroundPlayer.play();
    } catch (err: any) {
      Sentry.logger.error('Audio error: play', {
        error: err?.message ?? String(err),
      });
      Sentry.captureException(err);
      set({audioLoading: false});
      if (token === playToken) duckMusic(false);
    }
  },
  stop: () => {
    playToken++;
    foregroundCallback = null;
    try {
      foregroundPlayer?.pause();
    } catch {}
    duckMusic(false);
    set({audioLoading: false});
  },
  replay: async () => {
    const player = get().currentPlayer;
    if (!player) return;
    try {
      await player.seekTo(0);
      duckMusic(true);
      player.play();
    } catch (err: any) {
      Sentry.logger.error('Audio error: replay', {
        error: err?.message ?? String(err),
      });
      Sentry.captureException(err);
      duckMusic(false);
    }
  },
  playBackground: async (src: AudioSource) => {
    errorSafe(() => {
      if (backgroundPlayer && backgroundSource === src) return;
      const shouldPlay = !get().backgroundLoaded || get().backgroundPlaying;

      if (backgroundPlayer) {
        backgroundPlayer.pause();
        backgroundPlayer.replace(src);
      } else {
        backgroundPlayer = createAudioPlayer(src);
      }
      backgroundSource = src;
      backgroundPlayer.loop = true;
      backgroundPlayer.volume = musicDucked
        ? DUCKED_MUSIC_VOLUME
        : MUSIC_VOLUME;
      if (shouldPlay) backgroundPlayer.play();
      set({backgroundLoaded: true, backgroundPlaying: shouldPlay});
    }, 'Audio error: playBackground');
    // Le splash attend backgroundLoaded : il doit passer à true même si la lecture échoue.
    if (!get().backgroundLoaded) set({backgroundLoaded: true});
  },
  // L'enfant vient de choisir cette musique : elle joue même si la musique était coupée.
  startBackground: async (src: AudioSource) => {
    await get().playBackground(src);
    if (!get().backgroundPlaying) get().toggleBackground();
  },
  toggleBackground: () => {
    let playing = get().backgroundPlaying;
    errorSafe(() => {
      // Le système peut avoir coupé la musique (perte du focus audio) sans que le store le sache.
      const audible = playing && (backgroundPlayer?.playing ?? true);
      if (audible) {
        backgroundPlayer?.pause();
      } else {
        backgroundPlayer?.play();
      }
      playing = !audible;
      set({backgroundPlaying: playing});
    }, 'Audio error: toggleBackground');
    return playing;
  },
}));
