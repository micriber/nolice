import { create } from 'zustand'
import {Audio, AVPlaybackSource, AVPlaybackStatus} from "expo-av";

interface AudioStoreState {
  stop: () => Promise<void>
  current: Audio.Sound | null
  play: (src: AVPlaybackSource) => Promise<AVPlaybackStatus | void>
}

const DOMMAGE_SOUND_PATH = '../../assets/audio/dommage.mp3'
const BRAVO_SOUND_PATH = '../../assets/audio/bravo.mp3'
const COUNT_DUCK_SOUND_PATH = '../../assets/audio/duck.mp3'
const CONGRATULATION_SOUND_PATH = '../../assets/audio/congratulation.mp3'
const RETRY_SOUND_PATH = '../../assets/audio/retry.mp3'

export const SOUNDS = {
  DOMMAGE: require(DOMMAGE_SOUND_PATH),
  RETRY: require(RETRY_SOUND_PATH),
  BRAVO: require(BRAVO_SOUND_PATH),
  CONGRATULATION: require(CONGRATULATION_SOUND_PATH),
  COUNT: {
    DUCK: require(COUNT_DUCK_SOUND_PATH)
  }
}

export const useSoundStore = create<AudioStoreState>((set, get) => ({
  current: null,
  play: async (src: AVPlaybackSource) => {
    const { sound } = await Audio.Sound.createAsync(src);
    await get().stop()
    set(() => ({current: sound}));
    return get().current?.playAsync()
  },
  stop: async () => {
    await get().current?.stopAsync()
    await get().current?.unloadAsync();
  }
}));
