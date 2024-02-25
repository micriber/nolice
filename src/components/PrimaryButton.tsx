import {StyleSheet, Text, TouchableOpacity} from "react-native";

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
    width: 190,
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
    color: '#f3f1f1',
    fontWeight: "bold",
  }
});
