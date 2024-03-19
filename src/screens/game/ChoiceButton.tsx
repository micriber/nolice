import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import COLORS from "../../utils/color";
import FONT from "../../utils/font";

export default function ChoiceButton(props: { value: string, onPress: () => void }) {
  return <View style={styles.containerView}>
    <TouchableOpacity
      style={styles.playButton}
      onPress={props.onPress}
    >
      <Text style={styles.playButtonText}>{props.value}</Text>
    </TouchableOpacity>
  </View>;
}

const styles = StyleSheet.create({
  containerView: {
    width: "50%",
    height: "50%",
    alignItems: "center",
  },
  playButton: {
    alignItems: "center",
    backgroundColor: COLORS.BUTTON.SECONDARY,
    width: "70%",
    height: "70%",
    justifyContent: "center",
    borderRadius: 50,
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
    marginBottom: 5,
  }
});
