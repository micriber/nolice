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
const RETRY_SOUND_PATH = '../../assets/audio/retry.mp3';
const MUSIC_SOUND_PATH = '../../assets/audio/music.mp3';
const ANSWER_ONE_SOUND_PATH = '../../assets/audio/response-one.mp3';
const ANSWER_TWO_SOUND_PATH = '../../assets/audio/response-two.mp3';
const ANSWER_THREE_SOUND_PATH = '../../assets/audio/response-three.mp3';
const ANSWER_FOUR_SOUND_PATH = '../../assets/audio/response-four.mp3';
const ANSWER_FIVE_SOUND_PATH = '../../assets/audio/response-five.mp3';
const ANSWER_SIX_SOUND_PATH = '../../assets/audio/response-six.mp3';
const ANSWER_SEVEN_SOUND_PATH = '../../assets/audio/response-seven.mp3';
const ANSWER_EIGHT_SOUND_PATH = '../../assets/audio/response-eight.mp3';
const ANSWER_NINE_SOUND_PATH = '../../assets/audio/response-nine.mp3';

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

export interface SoundCountType {
  [key: string]: AVPlaybackSource;
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
