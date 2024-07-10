import {MaterialCommunityIcons} from '@expo/vector-icons';
import analytics from '@react-native-firebase/analytics';
import React from 'react';
import {TouchableOpacity} from 'react-native';

import COLORS from '../utils/color';
import FONT from '../utils/font';
import TrackPlayer, {State} from "react-native-track-player";

export default function SoundButton() {

  const toggleBackgroundPlaying = async () => {
    const {state} = await TrackPlayer.getPlaybackState();
    if (state === State.Playing) {
      await TrackPlayer.pause()
    } else {
      await TrackPlayer.play()
    }
  };

  return (
    <TouchableOpacity
      onPress={async () => {
        const {state} = await TrackPlayer.getPlaybackState();
        await analytics().logEvent('sound', {
          pause: state === State.Playing ? 'pause' : 'unpause',
        });
        await toggleBackgroundPlaying();
      }}>
      <MaterialCommunityIcons
        name={'music'}
        style={{
          fontSize: FONT.SIZE.BIG,
        }}
        color={COLORS.ICON}
      />
    </TouchableOpacity>
  );
}
