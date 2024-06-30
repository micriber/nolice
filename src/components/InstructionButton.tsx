import {MaterialCommunityIcons} from '@expo/vector-icons';
import analytics from '@react-native-firebase/analytics';
import {AVPlaybackSource} from 'expo-av';
import React from 'react';
import {TouchableOpacity} from 'react-native';

import {useSoundStore} from '../store/audio';
import COLORS from '../utils/color';
import FONT from '../utils/font';

type Props = {
  sound: AVPlaybackSource;
};
export default function InstructionButton(props: Props) {
  const soundStore = useSoundStore();

  return (
    <TouchableOpacity
      onPress={async () => {
        await analytics().logEvent('instruction');
        await soundStore.play(props.sound);
      }}>
      <MaterialCommunityIcons
        name="account-voice"
        style={{
          fontSize: FONT.SIZE.BIG,
        }}
        color={COLORS.ICON}
      />
    </TouchableOpacity>
  );
}
