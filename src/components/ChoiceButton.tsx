import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {REGULAR_FONT} from "../config/theme";

export default function ChoiceButton(props: { value: string, onPress: () => void }) {
  return <View style={[
    {
      flex: 1,
      alignItems: 'center',
    }
  ]}>
    <TouchableOpacity
      style={{
        alignItems: "center",
        backgroundColor: "#8ff672",
        width: "30%",
        justifyContent: "center",
        borderRadius: 25,
      }}
      onPress={props.onPress}
    >
      <Text style={styles.playButtonText}>{props.value}</Text>
    </TouchableOpacity>
  </View>;
}

const styles = StyleSheet.create({
  playButtonText: {
    fontSize: 30,
    color: "#ffffff",
    fontWeight: "bold",
    fontFamily: REGULAR_FONT,
  }
});
