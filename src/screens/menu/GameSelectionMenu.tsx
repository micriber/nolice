import analytics from '@react-native-firebase/analytics';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StyleSheet, Text, View} from 'react-native';

import MusicButton from '../../components/MusicButton';
import PrimaryButton from '../../components/PrimaryButton';
import {SOUNDS} from '../../store/audio';
import COLORS from '../../utils/color';
import FONT from '../../utils/font';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function GameSelectionMenu({navigation}: Props) {
  const handleNumberButton = async () => {
    await analytics().logEvent('NumberGame');
    navigation.navigate('NumberGame');
  };

  const handleColorButton = async () => {
    await analytics().logEvent('ColorGame');
    const questionConfig = [
      {key: 'yellow', label: 'le jaune', sound: SOUNDS.COLOR.YELLOW},
      {key: 'red', label: 'le rouge', sound: SOUNDS.COLOR.RED},
      {key: 'brown', label: 'le marron', sound: SOUNDS.COLOR.BROWN},
      {key: 'blue', label: 'le bleu', sound: SOUNDS.COLOR.BLUE},
      {key: 'pink', label: 'le rose', sound: SOUNDS.COLOR.PINK},
      {key: 'green', label: 'le vert', sound: SOUNDS.COLOR.GREEN},
      {key: 'black', label: 'le noir', sound: SOUNDS.COLOR.BLACK},
      {key: 'purple', label: 'le voilet', sound: SOUNDS.COLOR.PURPLE},
      {key: 'orange', label: "l'orange", sound: SOUNDS.COLOR.ORANGE},
      {key: 'gray', label: 'le gris', sound: SOUNDS.COLOR.GREY},
    ];
    navigation.navigate('FindGame', {questionConfig, gameType: 'color'});
  };

  const handleAnimalButton = async () => {
    await analytics().logEvent('AnimalGame');
    const questionConfig = [
      {key: 'bird', label: "l'oiseau", sound: SOUNDS.ANIMAL.BIRD},
      {key: 'cat', label: 'le chat', sound: SOUNDS.ANIMAL.CAT},
      {key: 'cow', label: 'la vache', sound: SOUNDS.ANIMAL.COW},
      {key: 'dog', label: 'le chien', sound: SOUNDS.ANIMAL.DOG},
      {key: 'duck', label: 'le canard', sound: SOUNDS.ANIMAL.DUCK},
      {key: 'pig', label: 'le cochon', sound: SOUNDS.ANIMAL.PIG},
      {key: 'rabbit', label: 'le lapin', sound: SOUNDS.ANIMAL.RABBIT},
      {key: 'sheep', label: 'le mouton', sound: SOUNDS.ANIMAL.MOUTON},
    ];
    navigation.navigate('FindGame', {questionConfig, gameType: 'animal'});
  };

  const handleShapeButton = async () => {
    await analytics().logEvent('ShapeGame');
    const questionConfig = [
      {key: 'circle', label: 'le cercle', sound: SOUNDS.SHAPE.CIRCLE},
      {key: 'cross', label: 'la croix', sound: SOUNDS.SHAPE.CROSS},
      {key: 'heart', label: 'le coeur', sound: SOUNDS.SHAPE.HEART},
      {key: 'losange', label: 'le losange', sound: SOUNDS.SHAPE.LOSANGE},
      {key: 'oval', label: "l'ovale", sound: SOUNDS.SHAPE.OVAL},
      {key: 'rectangle', label: 'le rectangle', sound: SOUNDS.SHAPE.RECTANGLE},
      {key: 'square', label: 'le caré', sound: SOUNDS.SHAPE.SQUARE},
      {key: 'star', label: "l'étoile", sound: SOUNDS.SHAPE.STAR},
      {key: 'triangle', label: 'le triangle', sound: SOUNDS.SHAPE.TRIANGLE},
    ];
    navigation.navigate('FindGame', {questionConfig, gameType: 'shape'});
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titre}>Selection du jeu</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.body}>
          <PrimaryButton
            name="NOMBRE"
            onPress={handleNumberButton}
            game="number"
          />
        </View>
        <View style={styles.body}>
          <PrimaryButton
            name="COULEUR"
            onPress={handleColorButton}
            game="color"
          />
        </View>
        <View style={styles.body}>
          <PrimaryButton
            name="ANIMAUX"
            onPress={handleAnimalButton}
            game="animal"
          />
        </View>
        <View style={styles.body}>
          <PrimaryButton
            name="FORME"
            onPress={handleShapeButton}
            game="shape"
          />
        </View>
      </View>
      <View style={styles.footer}>
        <MusicButton />
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
    width: '100%',
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
