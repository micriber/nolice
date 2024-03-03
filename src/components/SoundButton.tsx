import {TouchableOpacity} from "react-native";
import {useSoundStore} from "../store/audio";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from "../utils/color";
import analytics from "@react-native-firebase/analytics";

export default function SoundButton() {
  const soundStore = useSoundStore()

  return <TouchableOpacity
      onPress={async () => {
        await analytics().logEvent('sound', {
          pause: soundStore.backgroundPlaying ? 'pause' : 'unpause',
        })
        soundStore.backgroundPlaying ? soundStore.pauseBackground() : soundStore.unPauseBackground();
      }}
    >
      <MaterialCommunityIcons name={soundStore.backgroundPlaying ? 'music-off' : 'music'} size={40} color={COLORS.ICON} />
    </TouchableOpacity>;
}
