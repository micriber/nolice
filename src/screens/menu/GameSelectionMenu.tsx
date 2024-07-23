import analytics from '@react-native-firebase/analytics';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StyleSheet, Text, View} from 'react-native';

import MusicButton from '../../components/MusicButton';
import PrimaryButton from '../../components/PrimaryButton';
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
      {key: 'yellow', label: 'le jaune'},
      {key: 'red', label: 'le rouge'},
      {key: 'brown', label: 'le marron'},
      {key: 'blue', label: 'le bleu'},
      {key: 'pink', label: 'le rose'},
      {key: 'green', label: 'le vert'},
      {key: 'black', label: 'le noir'},
      {key: 'purple', label: 'le voilet'},
      {key: 'orange', label: "l'orange"},
      {key: 'grey', label: 'le gris'},
    ];
    navigation.navigate('FindGame', {questionConfig, gameType: 'color'});
  };

  const handleAnimalButton = async () => {
    await analytics().logEvent('AnimalGame');
    const questionConfig = [
      {key: 'bird', label: "l'oiseau"},
      {key: 'cat', label: 'le chat'},
      {key: 'cow', label: 'la vache'},
      {key: 'dog', label: 'le chien'},
      {key: 'duck', label: 'le canard'},
      {key: 'pig', label: 'le cochon'},
      {key: 'rabbit', label: 'le lapin'},
      {key: 'sheep', label: 'le mouton'},
    ];
    navigation.navigate('FindGame', {questionConfig, gameType: 'animal'});
  };

  const handleShapeButton = async () => {
    await analytics().logEvent('ShapeGame');
    const questionConfig = [
      {key: 'circle', label: 'le cercle'},
      {key: 'cross', label: 'la croix'},
      {key: 'heart', label: 'le coeur'},
      {key: 'losange', label: 'le losange'},
      {key: 'oval', label: "l'ovale"},
      {key: 'rectangle', label: 'le rectangle'},
      {key: 'square', label: 'le caré'},
      {key: 'star', label: "l'étoile"},
      {key: 'triangle', label: 'le triangle'},
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
