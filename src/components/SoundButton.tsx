import {TouchableOpacity, View} from "react-native";
import {useSoundStore} from "../store/audio";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from "../utils/color";
import analytics from "@react-native-firebase/analytics";
import React from "react";
import FONT from "../utils/font";

export default function SoundButton() {
  const soundStore = useSoundStore()

  return <TouchableOpacity
      onPress={async () => {
        await analytics().logEvent('sound', {
          pause: soundStore.backgroundPlaying ? 'pause' : 'unpause',
        })
        soundStore.backgroundPlaying ? await soundStore.pauseBackground() : await soundStore.unPauseBackground();
      }}
    >
      <MaterialCommunityIcons name={soundStore.backgroundPlaying ? 'music-off' : 'music'} style={
        {
          fontSize: FONT.SIZE.BIG,
        }
      } color={COLORS.ICON} />
    </TouchableOpacity>;
}
