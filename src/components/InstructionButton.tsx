import {TouchableOpacity, View} from "react-native";
import {useSoundStore} from "../store/audio";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from "../utils/color";
import analytics from "@react-native-firebase/analytics";
import React from "react";
import FONT from "../utils/font";
import {AVPlaybackSource} from "expo-av";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

type Props = {
  sound: AVPlaybackSource;
};
export default function InstructionButton(props: Props) {
  const soundStore = useSoundStore()

  return <TouchableOpacity
      onPress={async () => {
        await soundStore.play(props.sound);
      }}
    >
      <MaterialCommunityIcons name={'account-voice'} style={
        {
          fontSize: FONT.SIZE.BIG,
        }
      } color={COLORS.ICON} />
    </TouchableOpacity>;
}
