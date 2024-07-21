import * as Sentry from '@sentry/react-native';
import {
  Audio,
  AVPlaybackSource,
  AVPlaybackStatus,
  InterruptionModeAndroid,
} from 'expo-av';
import {AVPlaybackStatusSuccess} from 'expo-av/src/AV.types';
import {create} from 'zustand';

interface AudioStoreState {
  backgroundPlaying: boolean;
  backgroundLoaded: boolean;
  soundObject: Audio.SoundObject | null;
  pauseBackground: () => Promise<void>;
  unPauseBackground: () => Promise<void>;
  playBackground: (src: AVPlaybackSource) => Promise<void>;
  play: (src: AVPlaybackSource, callback?: () => void) => Promise<void>;
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
const DUCK_SOUND_PATH = '../../assets/audio/duck.mp3';
const CAT_SOUND_PATH = '../../assets/audio/cat.mp3';
const DOG_SOUND_PATH = '../../assets/audio/dog.mp3';
const PIG_SOUND_PATH = '../../assets/audio/pig.mp3';
const COW_SOUND_PATH = '../../assets/audio/cow.mp3';
const RABBIT_SOUND_PATH = '../../assets/audio/rabbit.mp3';
const BIRD_SOUND_PATH = '../../assets/audio/bird.mp3';
const SHEEP_SOUND_PATH = '../../assets/audio/sheep.mp3';
const CIRCLE_SOUND_PATH = '../../assets/audio/shape-circle.mp3';
const CROSS_SOUND_PATH = '../../assets/audio/shape-cross.mp3';
const HEART_SOUND_PATH = '../../assets/audio/shape-heart.mp3';
const LOSANGE_SOUND_PATH = '../../assets/audio/shape-losange.mp3';
const OVAL_SOUND_PATH = '../../assets/audio/shape-oval.mp3';
const RECTANGLE_SOUND_PATH = '../../assets/audio/shape-rectangle.mp3';
const SQUARE_SOUND_PATH = '../../assets/audio/shape-square.mp3';
const STAR_SOUND_PATH = '../../assets/audio/shape-star.mp3';
const TRIANGLE_SOUND_PATH = '../../assets/audio/shape-triangle.mp3';
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
const RETRY_SOUND_PATH = '../../assets/audio/retry.mp3';
const MUSIC_SOUND_PATH = '../../assets/audio/music.mp3';

type SoundsTypeQuestion = {
  [gameType: string]: SoundQuestionType;
};

export interface SoundQuestionType {
  [key: string]: {
    QUESTION: AVPlaybackSource;
    ANSWER: AVPlaybackSource;
  };
}

type SoundsType = {
  DOMMAGE: AVPlaybackSource;
  RETRY: AVPlaybackSource;
  BRAVO: AVPlaybackSource;
  MUSIC: AVPlaybackSource;
  CONGRATULATION: AVPlaybackSource;
};

export const SOUNDS: SoundsType = {
  MUSIC: require(MUSIC_SOUND_PATH),
  DOMMAGE: require(DOMMAGE_SOUND_PATH),
  RETRY: require(RETRY_SOUND_PATH),
  BRAVO: require(BRAVO_SOUND_PATH),
  CONGRATULATION: require(CONGRATULATION_SOUND_PATH),
};
export const SOUNDS_QUESTION: SoundsTypeQuestion = {
  COUNT: {
    DUCK: require(COUNT_DUCK_SOUND_PATH),
    CAT: require(COUNT_CAT_SOUND_PATH),
    DOG: require(COUNT_DOG_SOUND_PATH),
    PIG: require(COUNT_PIG_SOUND_PATH),
    COW: require(COUNT_COW_SOUND_PATH),
    RABBIT: require(COUNT_RABBIT_SOUND_PATH),
    BIRD: require(COUNT_BIRD_SOUND_PATH),
    SHEEP: require(COUNT_SHEEP_SOUND_PATH),
  },
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
    BIRD: require(BIRD_SOUND_PATH),
    CAT: require(CAT_SOUND_PATH),
    COW: require(COW_SOUND_PATH),
    DOG: require(DOG_SOUND_PATH),
    DUCK: require(DUCK_SOUND_PATH),
    PIG: require(PIG_SOUND_PATH),
    RABBIT: require(RABBIT_SOUND_PATH),
    SHEEP: require(SHEEP_SOUND_PATH),
  },
  SHAPE: {
    CIRCLE: require(CIRCLE_SOUND_PATH),
    CROSS: require(CROSS_SOUND_PATH),
    HEART: require(HEART_SOUND_PATH),
    LOSANGE: require(LOSANGE_SOUND_PATH),
    OVAL: require(OVAL_SOUND_PATH),
    RECTANGLE: require(RECTANGLE_SOUND_PATH),
    SQUARE: require(SQUARE_SOUND_PATH),
    STAR: require(STAR_SOUND_PATH),
    TRIANGLE: require(TRIANGLE_SOUND_PATH),
  },
};

function errorSafe(callback: () => void, message: string = 'Audio error:') {
  try {
    callback();
  } catch (error: any) {
    console.error(message, error);
    if (error.name !== 'AudioFocusNotAcquiredException') {
      Sentry.withScope(function () {
        Sentry.captureException(error);
      });
    }
  }
}

const soundObjectBackground = new Audio.Sound();

export const useSoundStore = create<AudioStoreState>((set, get) => ({
  backgroundPlaying: false,
  backgroundLoaded: false,
  soundObject: null,
  play: async (src: AVPlaybackSource, callback?: () => void) => {
    const {soundObject} = get();
    if (soundObject?.sound && !soundObject?.status?.isLoaded) {
      return Promise.reject(new Error('Audio not loaded'));
    }

    try {
      if (
        soundObject?.sound &&
        isAVPlaybackStatusSuccess(soundObject.status) &&
        soundObject?.status?.isPlaying
      ) {
        await soundObject.sound.stopAsync();
      }
    } catch (err) {
      console.log(soundObject?.status);
      if (
        soundObject?.sound &&
        isAVPlaybackStatusSuccess(soundObject.status) &&
        soundObject?.status?.positionMillis > 0
      ) {
        console.error('Audio error: stop', err);
      } else {
        console.log('Audio log: stop', err);
      }
    }

    try {
      if (soundObject?.sound) {
        await soundObject.sound.unloadAsync();
      }
    } catch (err) {
      console.log(soundObject?.status);
      console.error('Audio error: unload', err);
    }

    try {
      const soundObject = await Audio.Sound.createAsync(src, {
        shouldPlay: true,
      });
      if (!isAVPlaybackStatusSuccess(soundObject.status)) {
        return Promise.reject(new Error('Audio not not success loaded'));
      }
      set({soundObject});
      soundObject.sound.setOnPlaybackStatusUpdate((status) => {
        if (isAVPlaybackStatusSuccess(status)) {
          if (status.didJustFinish) {
            soundObject.sound.unloadAsync();
            set({soundObject: null});
            if (callback) {
              callback();
            }
          }
        } else {
          console.error('Audio error: status', status);
        }
      });
    } catch (err) {
      console.error('Audio error: play', err);
      set({soundObject: null});
    }
  },
  playBackground: async (src: AVPlaybackSource) => {
    errorSafe(async () => {
      if (!get().backgroundPlaying) {
        await Audio.setAudioModeAsync({
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        });
        await soundObjectBackground.unloadAsync();
        set(() => ({backgroundLoaded: true}));
        set({backgroundPlaying: true});
        await soundObjectBackground.loadAsync(src);
        await soundObjectBackground.setIsLoopingAsync(true);
        await soundObjectBackground.setVolumeAsync(0.2);
        await soundObjectBackground.playFromPositionAsync(2000);
      }
    }, 'Audio error: playBackground');
  },
  pauseBackground: async () => {
    errorSafe(async () => {
      await soundObjectBackground.pauseAsync();
      set({backgroundPlaying: false});
    }, 'Audio error: pauseBackground');
  },
  unPauseBackground: async () => {
    errorSafe(async () => {
      await soundObjectBackground.playAsync();
      set({backgroundPlaying: true});
    }, 'Audio error: unPauseBackground');
  },
}));

function isAVPlaybackStatusSuccess(
  src: AVPlaybackStatus,
): src is AVPlaybackStatusSuccess {
  return !('error' in src);
}
