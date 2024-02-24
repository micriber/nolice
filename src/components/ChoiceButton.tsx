import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

export default function ChoiceButton(props: { answer: string, onPress: () => void }) {
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
      <Text style={styles.playButtonText}>6</Text>
    </TouchableOpacity>
  </View>;
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
