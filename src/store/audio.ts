import { create } from 'zustand'
import {Audio, AVPlaybackSource, AVPlaybackStatus} from "expo-av";

interface AudioStoreState {
  stop: () => Promise<void>
  pauseBackground: () => Promise<void>
  unPauseBackground: () => Promise<void>
  backgroundPlaying: boolean
  current: Audio.Sound | null
  currentBackground: Audio.Sound | null
  play: (src: AVPlaybackSource) => Promise<AVPlaybackStatus | void>
  playBackground: (src: AVPlaybackSource) => Promise<AVPlaybackStatus | void>
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

export const useSoundStore = create<AudioStoreState>((set, get) => ({
  current: null,
  currentBackground: null,
  backgroundPlaying: false,
  play: async (src: AVPlaybackSource) => {
    const { sound } = await Audio.Sound.createAsync(src);
    await get().stop()
    set(() => ({current: sound}));
    return get().current?.playAsync()
  },
  playBackground: async (src: AVPlaybackSource) => {
    const { sound } = await Audio.Sound.createAsync(src);
    await get().currentBackground?.stopAsync()
    await get().currentBackground?.unloadAsync();
    set(() => ({currentBackground: sound}));
    await get().currentBackground?.setIsLoopingAsync(true);
    await get().currentBackground?.setVolumeAsync(0.2);
    set(() => ({backgroundPlaying: true}));
    return get().currentBackground?.playFromPositionAsync(2000);
  },
  pauseBackground: async () => {
    set(() => ({backgroundPlaying: false}));
    return get().currentBackground?.pauseAsync();
  },
  unPauseBackground: async () => {
    set(() => ({backgroundPlaying: true}));
    return get().currentBackground?.playAsync();
  },
  stop: async () => {
    await get().current?.stopAsync()
    await get().current?.unloadAsync();
  }
}));
