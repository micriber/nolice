import {StyleSheet, Text, View} from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useGameScoreStore} from "../../store/game";
import SoundButton from "../../components/SoundButton";
import COLORS from "../../utils/color";
import analytics from '@react-native-firebase/analytics';
import FONT from "../../utils/font";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function GameSelectionMenu({ navigation } : Props) {
  const store = useGameScoreStore()

  const handleNumberButton = async () => {
    await analytics().logEvent('NumberGame')
    navigation.navigate('NumberGame')
  }

  const handleColorButton = async () => {
    await analytics().logEvent('ColorGame')
    navigation.navigate('ColorGame');
  }

  const handleAnimalButton = async () => {
    store.init(10, 9)
    await analytics().logEvent('AnimalGame')
    navigation.navigate('MainMenu')
  }

  const handleShapeButton = async () => {
    store.init(10, 9)
    await analytics().logEvent('ShapeGame')
    navigation.navigate('MainMenu')
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titre}>Selection du jeu</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.body}>
          <PrimaryButton name="NOMBRE" onPress={handleNumberButton} game={'number'}/>
        </View>
        <View style={styles.body}>
          <PrimaryButton name="COULEUR" onPress={handleColorButton} game={'color'}/>
        </View>
        <View style={styles.body}>
          <PrimaryButton name="ANIMAUX" onPress={handleAnimalButton} animal={'duck'}/>
        </View>
        <View style={styles.body}>
          <PrimaryButton name="FORME" onPress={handleShapeButton} animal={'bird'}/>
        </View>
      </View>
      <View style={styles.footer}>
        <SoundButton/>
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
    fontSize: FONT.SIZE.SMALL,
  },
  titre: {
    textAlign: 'center',
    fontSize: FONT.SIZE.MEDIUM,
    fontFamily: FONT.FAMILY,
    color: COLORS.FONT.BASE,
  },
  body: {
    flex: 5,
    alignItems: 'center',
    width: "100%",
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
  },
});
