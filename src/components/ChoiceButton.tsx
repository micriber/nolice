import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

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
    flex: 1,
    alignItems: 'center',
  },
  playButton: {
    alignItems: "center",
    backgroundColor: "#8ff672",
    width: 75,
    height: 75,
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
    fontSize: 30,
    color: "#ffffff",
    fontFamily: "TitilliumWeb_700Bold",
    marginBottom: 5,
  }
});
