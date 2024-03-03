import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
// @ts-ignore
import Logo from "../../../assets/svg/logo.svg";
import PrimaryButton from "../../components/PrimaryButton";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useGameScoreStore} from "../../store/game";
import SoundButton from "../../components/SoundButton";
import COLORS from "../../utils/color";
import analytics from '@react-native-firebase/analytics';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export default function MenuScreen({ navigation } : Props) {
  const store = useGameScoreStore()
  const handleClick = async () => {
    store.init()
    await analytics().logEvent('play')
    navigation.navigate('Game')
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
  },
});
