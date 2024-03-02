import {TouchableOpacity} from "react-native";
import {useSoundStore} from "../store/audio";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from "../utils/color";

export default function SoundButton() {
  const soundStore = useSoundStore()

  return <TouchableOpacity
      onPress={() => {
        soundStore.backgroundPlaying ? soundStore.pauseBackground() : soundStore.unPauseBackground();
      }}
    >
      <MaterialCommunityIcons name={soundStore.backgroundPlaying ? 'music-off' : 'music'} size={40} color={COLORS.ICON} />
    </TouchableOpacity>;
}
