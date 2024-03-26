import {StyleSheet, View} from "react-native";
// @ts-ignore
import Logo from "../../../assets/svg/logo.svg";
import PrimaryButton from "../../components/PrimaryButton";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import SoundButton from "../../components/SoundButton";
import COLORS from "../../utils/color";
import analytics from '@react-native-firebase/analytics';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function MainMenuScreen({ navigation } : Props) {
  const handleClick = async () => {
    // await analytics().logEvent('play')
    navigation.navigate('GameSelectionMenu')
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo/>
      </View>
      <View style={styles.body}>
        <View style={styles.body}>
          <PrimaryButton name="JOUER" onPress={handleClick}/>
        </View>
        <View style={styles.body}>
          <SoundButton/>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
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
    alignItems: 'center',
    width: "100%",
  },
});
