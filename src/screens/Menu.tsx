import {StyleSheet, View} from "react-native";
import Logo from "../../assets/svg/logo.svg";
import PrimaryButton from "../components/PrimaryButton";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function MenuScreen({ navigation } : Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo/>
      </View>
      <View style={styles.body}>
        <PrimaryButton name="JOUER" onPress={() => {
          navigation.navigate('Game')
        }}/>
      </View>
    </View>
  );
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
