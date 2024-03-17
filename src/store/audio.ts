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
const COUNT_DUCK_SOUND_PATH = '../../assets/audio/duck.mp3'
const COUNT_CAT_SOUND_PATH = '../../assets/audio/cat.mp3'
const COUNT_DOG_SOUND_PATH = '../../assets/audio/dog.mp3'
const COUNT_PIG_SOUND_PATH = '../../assets/audio/pig.mp3'
const COUNT_COW_SOUND_PATH = '../../assets/audio/cow.mp3'
const COUNT_RABBIT_SOUND_PATH = '../../assets/audio/rabbit.mp3'
const COUNT_BIRD_SOUND_PATH = '../../assets/audio/bird.mp3'
const COUNT_SHEEP_SOUND_PATH = '../../assets/audio/sheep.mp3'
const CONGRATULATION_SOUND_PATH = '../../assets/audio/congratulation.mp3'
const RETRY_SOUND_PATH = '../../assets/audio/retry.mp3'
const MUSIC_SOUND_PATH = '../../assets/audio/music.mp3'

type SoundsType = {
  DOMMAGE: AVPlaybackSource,
  RETRY: AVPlaybackSource,
  BRAVO: AVPlaybackSource,
  MUSIC: AVPlaybackSource,
  CONGRATULATION: AVPlaybackSource
  COUNT: {
    [k: string]: AVPlaybackSource
  },
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

const soundObject = new Audio.Sound();
const soundObjectBackground = new Audio.Sound();

export const useSoundStore = create<AudioStoreState>((set, get) => ({
  backgroundPlaying: false,
  backgroundLoaded: false,
  play: async (src: AVPlaybackSource) => {
    errorSafe(async () => {
      await soundObject.unloadAsync();
      await Audio.setAudioModeAsync({
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      });
      await soundObject.loadAsync(src, { shouldPlay: true })
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
