import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';

// @ts-ignore
import ColorLogo from '../../../assets/svg/logo-color-game.svg';
// @ts-ignore
import NumberLogo from '../../../assets/svg/logo-number-game.svg';
import MusicButton from '../../components/MusicButton';
import {AnimalImage} from '../game/animal-picture';
import {ShapeImage} from '../game/shape-picture';
import COLORS from '../../utils/color';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function GameSelectionMenu({navigation}: Props) {
  const handleNumberButton = async () => {
    await logEvent(getAnalytics(), 'NumberGame');
    navigation.navigate('NumberGame');
  };

  const handleColorButton = async () => {
    await logEvent(getAnalytics(), 'ColorGame');
    const questionConfig = [
      {key: 'yellow', label: 'le jaune'},
      {key: 'red', label: 'le rouge'},
      {key: 'brown', label: 'le marron'},
      {key: 'blue', label: 'le bleu'},
      {key: 'pink', label: 'le rose'},
      {key: 'green', label: 'le vert'},
      {key: 'black', label: 'le noir'},
      {key: 'purple', label: 'le violet'},
      {key: 'orange', label: "l'orange"},
      {key: 'grey', label: 'le gris'},
    ];
    navigation.navigate('FindGame', {questionConfig, gameType: 'color'});
  };

  const handleAnimalButton = async () => {
    await logEvent(getAnalytics(), 'AnimalGame');
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
    await logEvent(getAnalytics(), 'ShapeGame');
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
    <SafeAreaView style={styles.container}>
      <View style={styles.grid}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.tile, {backgroundColor: COLORS.GAME.NUMBER}]}
            onPress={handleNumberButton}
            activeOpacity={0.8}>
            <View style={styles.tileIcon}>
              <NumberLogo />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tile, {backgroundColor: COLORS.GAME.COLOR}]}
            onPress={handleColorButton}
            activeOpacity={0.8}>
            <View style={styles.tileIcon}>
              <ColorLogo />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.tile, {backgroundColor: COLORS.GAME.ANIMAL}]}
            onPress={handleAnimalButton}
            activeOpacity={0.8}>
            <View style={styles.tileIcon}>
              <AnimalImage type="duck" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tile, {backgroundColor: COLORS.GAME.SHAPE}]}
            onPress={handleShapeButton}
            activeOpacity={0.8}>
            <View style={styles.tileIcon}>
              <ShapeImage type="star" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <MusicButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: RFPercentage(2.5),
    justifyContent: 'center',
  },
  grid: {
    flex: 5,
    justifyContent: 'center',
    gap: RFPercentage(2),
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: RFPercentage(2),
  },
  tile: {
    flex: 1,
    borderRadius: RFPercentage(3),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  tileIcon: {
    width: RFPercentage(15),
    height: RFPercentage(15),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
