import {StyleSheet, Text, View} from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useGameScoreStore} from "../../store/game";
import MusicButton from "../../components/MusicButton";
import COLORS from "../../utils/color";
import analytics from '@react-native-firebase/analytics';
import FONT from "../../utils/font";
import {SOUNDS} from "../../store/audio";

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
    const questionConfig= [
      {key: "yellow",  label: "le jaune", sound: SOUNDS.COLOR.YELLOW },
      {key: "red",  label: "le rouge", sound: SOUNDS.COLOR.RED },
      {key: "brown",  label: "le marron", sound: SOUNDS.COLOR.BROWN },
      {key: "blue",  label: "le bleu", sound: SOUNDS.COLOR.BLUE },
      {key: "pink",  label: "le rose", sound: SOUNDS.COLOR.PINK },
      {key: "green",  label: "le vert", sound: SOUNDS.COLOR.GREEN },
      {key: "black",  label: "le noir", sound: SOUNDS.COLOR.BLACK },
      {key: "purple",  label: "le voilet", sound: SOUNDS.COLOR.PURPLE },
      {key: "orange",  label: "l'orange", sound: SOUNDS.COLOR.ORANGE },
      {key: "gray",  label: "le gris", sound: SOUNDS.COLOR.GREY },
    ];
    navigation.navigate('FindGame', {questionConfig: questionConfig, gameType: 'color'});
  }

  const handleAnimalButton = async () => {
    await analytics().logEvent('AnimalGame')
    const questionConfig= [
      {key: "bird", label: "l'oiseau", sound: SOUNDS.ANIMAL.BIRD },
      {key: "cat", label: "le chat", sound: SOUNDS.ANIMAL.CAT },
      {key: "cow", label: "la vache", sound: SOUNDS.ANIMAL.COW },
      {key: "dog", label: "le chien", sound: SOUNDS.ANIMAL.DOG },
      {key: "duck", label: "le canard", sound: SOUNDS.ANIMAL.DUCK },
      {key: "pig", label: "le cochon", sound: SOUNDS.ANIMAL.PIG },
      {key: "rabbit", label: "le lapin", sound: SOUNDS.ANIMAL.RABBIT },
      {key: "sheep", label: "le mouton", sound: SOUNDS.ANIMAL.MOUTON },
    ];
    navigation.navigate('FindGame', {questionConfig: questionConfig, gameType: 'animal'});
  }

  const handleShapeButton = async () => {
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
        <MusicButton/>
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
