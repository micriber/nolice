import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {REGULAR_FONT} from "../config/theme";

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
    backgroundColor: '#f6da72',
    height: 50,
    justifyContent: 'center',
    borderRadius: 20,
    marginHorizontal: 80,
  },
  playButtonText: {
    fontSize: 30,
    color: "#ffffff",
    fontWeight: "bold",
    fontFamily: REGULAR_FONT,
  }
});
