import {MaterialCommunityIcons} from '@expo/vector-icons';
import analytics from '@react-native-firebase/analytics';
import React from 'react';
import {TouchableOpacity} from 'react-native';

import {useSoundStore} from '../store/audio';
import COLORS from '../utils/color';
import FONT from '../utils/font';

export default function SoundButton() {
  const soundStore = useSoundStore();

  const toggleBackgroundPlaying = async () => {
    if (soundStore.backgroundPlaying) {
      await soundStore.pauseBackground();
    } else {
      await soundStore.unPauseBackground();
    }
  };

  return (
    <TouchableOpacity
      onPress={async () => {
        await analytics().logEvent('sound', {
          pause: soundStore.backgroundPlaying ? 'pause' : 'unpause',
        });
        await toggleBackgroundPlaying();
      }}>
      <MaterialCommunityIcons
        name={soundStore.backgroundPlaying ? 'music-off' : 'music'}
        style={{
          fontSize: FONT.SIZE.BIG,
        }}
        color={COLORS.ICON}
      />
    </TouchableOpacity>
  );
}
