import {StyleSheet, Text, TouchableOpacity} from "react-native";
import COLORS from "../utils/color";
import FONT from "../utils/font";

export default function PrimaryButton(props: { name: string, onPress: () => void }) {
  return <TouchableOpacity
    style={styles.playButton}
    onPress={props.onPress}
  >
    <Text style={styles.playButtonText}>{props.name}</Text>
  </TouchableOpacity>;
}

const styles = StyleSheet.create({
  playButton: {
    alignItems: 'center',
    backgroundColor: COLORS.BUTTON.PRIMARY,
    justifyContent: 'center',
    borderRadius: 20,
    minWidth: "65%",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  playButtonText: {
    fontSize: FONT.SIZE.BASE,
    fontFamily: FONT.FAMILY,
    color: COLORS.FONT.BASE,
  }
});
