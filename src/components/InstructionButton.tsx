import {MaterialCommunityIcons} from '@expo/vector-icons';
import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {AudioSource} from 'expo-audio';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import {useSoundStore} from '../store/audio';
import COLORS from '../utils/color';

type Props = {
  sound: AudioSource;
};

export default function InstructionButton(props: Props) {
  const soundStore = useSoundStore();

  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.7}
      onPress={async () => {
        await logEvent(getAnalytics(), 'instruction');
        await soundStore.play(props.sound);
      }}>
      <MaterialCommunityIcons
        name="account-voice"
        size={RFPercentage(5)}
        color={COLORS.FONT.LIGHT}
      />
    </TouchableOpacity>
  );
}

const BUTTON_SIZE = RFPercentage(8);

const styles = StyleSheet.create({
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: COLORS.ICON,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
});
