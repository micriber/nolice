import * as Sentry from '@sentry/react-native';
import {File, Paths} from 'expo-file-system';
import {create} from 'zustand';

export type MascotKey = 'owl' | 'rabbit' | 'cat' | 'dog' | 'duck' | 'bird';
export type DecorKey = 'banquise' | 'bulles' | 'nuages';
export type MusicTrackKey = 'joyeuse' | 'calme';

export type Settings = {
  mascot: MascotKey;
  decor: DecorKey;
  musicTrack: MusicTrackKey;
};

const DEFAULTS: Settings = {
  mascot: 'owl',
  decor: 'nuages',
  musicTrack: 'joyeuse',
};

const settingsFile = () => new File(Paths.document, 'nolice-settings.json');

function loadSettings(): Settings {
  try {
    const file = settingsFile();
    if (!file.exists) return DEFAULTS;
    return {...DEFAULTS, ...JSON.parse(file.textSync())};
  } catch (err: any) {
    Sentry.logger.error('Settings error: load', {
      error: err?.message ?? String(err),
    });
    return DEFAULTS;
  }
}

function saveSettings(settings: Settings) {
  try {
    settingsFile().write(JSON.stringify(settings));
  } catch (err: any) {
    Sentry.logger.error('Settings error: save', {
      error: err?.message ?? String(err),
    });
    Sentry.captureException(err);
  }
}

interface SettingsState extends Settings {
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...loadSettings(),
  setSetting: (key, value) => {
    set({[key]: value});
    const {mascot, decor, musicTrack} = get();
    saveSettings({mascot, decor, musicTrack});
  },
}));
