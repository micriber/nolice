import {create, GetState, SetState, StoreApi} from 'zustand'
import {Audio, AVPlaybackSource, InterruptionModeAndroid} from "expo-av";
import * as Sentry from '@sentry/react-native';
import {get} from "react-native/Libraries/TurboModule/TurboModuleRegistry";

interface AudioStoreState {
  backgroundPlaying: boolean
  backgroundLoaded: boolean
  pauseBackground: () => Promise<void>
  unPauseBackground: () => Promise<void>
  playBackground: (src: AVPlaybackSource) => Promise<void>
  play: (src: AVPlaybackSource) => Promise<void>
}

const DOMMAGE_SOUND_PATH = '../../assets/audio/dommage.mp3'
const BRAVO_SOUND_PATH = '../../assets/audio/bravo.mp3'
const COUNT_DUCK_SOUND_PATH = '../../assets/audio/count-duck.mp3'
const COUNT_CAT_SOUND_PATH = '../../assets/audio/count-cat.mp3'
const COUNT_DOG_SOUND_PATH = '../../assets/audio/count-dog.mp3'
const COUNT_PIG_SOUND_PATH = '../../assets/audio/count-pig.mp3'
const COUNT_COW_SOUND_PATH = '../../assets/audio/count-cow.mp3'
const COUNT_RABBIT_SOUND_PATH = '../../assets/audio/count-rabbit.mp3'
const COUNT_BIRD_SOUND_PATH = '../../assets/audio/count-bird.mp3'
const COUNT_SHEEP_SOUND_PATH = '../../assets/audio/count-sheep.mp3'
const DUCK_SOUND_PATH = '../../assets/audio/duck.mp3'
const CAT_SOUND_PATH = '../../assets/audio/cat.mp3'
const DOG_SOUND_PATH = '../../assets/audio/dog.mp3'
const PIG_SOUND_PATH = '../../assets/audio/pig.mp3'
const COW_SOUND_PATH = '../../assets/audio/cow.mp3'
const RABBIT_SOUND_PATH = '../../assets/audio/rabbit.mp3'
const BIRD_SOUND_PATH = '../../assets/audio/bird.mp3'
const SHEEP_SOUND_PATH = '../../assets/audio/sheep.mp3'
const CIRCLE_SOUND_PATH = '../../assets/audio/shape-circle.mp3'
const CROSS_SOUND_PATH = '../../assets/audio/shape-cross.mp3'
const HEART_SOUND_PATH = '../../assets/audio/shape-heart.mp3'
const LOSANGE_SOUND_PATH = '../../assets/audio/shape-losange.mp3'
const OVAL_SOUND_PATH = '../../assets/audio/shape-oval.mp3'
const RECTANGLE_SOUND_PATH = '../../assets/audio/shape-rectangle.mp3'
const SQUARE_SOUND_PATH = '../../assets/audio/shape-square.mp3'
const STAR_SOUND_PATH = '../../assets/audio/shape-star.mp3'
const TRIANGLE_SOUND_PATH = '../../assets/audio/shape-triangle.mp3'
const BLACK_SOUND_PATH = '../../assets/audio/black.mp3'
const BLUE_SOUND_PATH = '../../assets/audio/blue.mp3'
const BROWN_SOUND_PATH = '../../assets/audio/brown.mp3'
const GREEN_SOUND_PATH = '../../assets/audio/green.mp3'
const PINK_SOUND_PATH = '../../assets/audio/pink.mp3'
const PURPLE_SOUND_PATH = '../../assets/audio/purple.mp3'
const RED_SOUND_PATH = '../../assets/audio/red.mp3'
const YELLOW_SOUND_PATH = '../../assets/audio/yellow.mp3'
const ORANGE_SOUND_PATH = '../../assets/audio/orange.mp3'
const GREY_SOUND_PATH = '../../assets/audio/grey.mp3'
const CONGRATULATION_SOUND_PATH = '../../assets/audio/congratulation.mp3'
const RETRY_SOUND_PATH = '../../assets/audio/retry.mp3'
const MUSIC_SOUND_PATH = '../../assets/audio/music.mp3'

type SoundsType = {
  DOMMAGE: AVPlaybackSource,
  RETRY: AVPlaybackSource,
  BRAVO: AVPlaybackSource,
  MUSIC: AVPlaybackSource,
  CONGRATULATION: AVPlaybackSource
  COUNT: { [k: string]: AVPlaybackSource },
  COLOR: { [k: string]: AVPlaybackSource },
  ANIMAL: { [k: string]: AVPlaybackSource },
  SHAPE: { [k: string]: AVPlaybackSource },
}

export const SOUNDS: SoundsType = {
  MUSIC: require(MUSIC_SOUND_PATH),
  DOMMAGE: require(DOMMAGE_SOUND_PATH),
  RETRY: require(RETRY_SOUND_PATH),
  BRAVO: require(BRAVO_SOUND_PATH),
  CONGRATULATION: require(CONGRATULATION_SOUND_PATH),
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
    YELLOW: require(YELLOW_SOUND_PATH),
    RED: require(RED_SOUND_PATH),
    BROWN: require(BROWN_SOUND_PATH),
    BLUE: require(BLUE_SOUND_PATH),
    PINK: require(PINK_SOUND_PATH),
    GREEN: require(GREEN_SOUND_PATH),
    BLACK: require(BLACK_SOUND_PATH),
    PURPLE: require(PURPLE_SOUND_PATH),
    ORANGE: require(ORANGE_SOUND_PATH),
    GREY: require(GREY_SOUND_PATH),
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
  }
}

function errorSafe(callback: () => void , message: string = "Audio error:"){
  try {
    callback();
  } catch (error: any) {
    console.error(message, error);
    if (error.name !== "AudioFocusNotAcquiredException") {
      Sentry.withScope(function(scope) {
        Sentry.captureException(error);
      });
    }
  }
}

const soundObjectBackground = new Audio.Sound();

export const useSoundStore = create<AudioStoreState>((set, get) => ({
  backgroundPlaying: false,
  backgroundLoaded: false,
  play: async (src: AVPlaybackSource) => {
    errorSafe(async () => {
      const soundObject = new Audio.Sound();
      await soundObject.unloadAsync();
      await Audio.setAudioModeAsync({
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      });
      await soundObject.loadAsync(src)
      await soundObject.playAsync()
    }, 'Audio error: play');
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
  }
}));
