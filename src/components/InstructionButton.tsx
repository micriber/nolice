import {MaterialCommunityIcons} from '@expo/vector-icons';
import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import React from 'react';
import {TouchableOpacity} from 'react-native';

import {useSoundStore} from '../store/audio';
import COLORS from '../utils/color';
import FONT from '../utils/font';

export default function InstructionButton() {
  const soundStore = useSoundStore();

  return (
    <TouchableOpacity
      onPress={async () => {
        await logEvent(getAnalytics(), 'instruction');
        await soundStore.replay();
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
