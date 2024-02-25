import { create } from 'zustand'
import {Audio, AVPlaybackSource, AVPlaybackStatus} from "expo-av";

interface AudioStoreState {
  stop: () => Promise<void>
  current: Audio.Sound | null
  play: (src: AVPlaybackSource) => Promise<AVPlaybackStatus | void>
}

const DOMMAGE_SOUND_PATH = '../../assets/audio/dommage.wav'
const BRAVO_SOUND_PATH = '../../assets/audio/bravo.wav'
const COUNT_DUCK_SOUND_PATH = '../../assets/audio/count-duck.wav'

export const SOUNDS = {
  DOMMAGE: require(DOMMAGE_SOUND_PATH),
  BRAVO: require(BRAVO_SOUND_PATH),
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
