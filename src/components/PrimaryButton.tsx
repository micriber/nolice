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
  container: {
    flex: 1,
    backgroundColor: '#53afd5',
    padding: 20,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  header: {
    flex: 2,
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    flex: 1,
  },
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
  }
});
