import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import {AnimalImage} from './animal-picture';
import {ColorImage} from './color-picture';
import {ShapeImage} from './shape-picture';
import COLORS from '../../utils/color';
import FONT from '../../utils/font';

export default function ChoiceButton(props: {
  value: string;
  type: string;
  onPress: () => void;
}) {
  let element;
  let bgColor;

  switch (props.type) {
    case 'number':
      element = <Text style={styles.numberText}>{props.value}</Text>;
      bgColor = COLORS.BUTTON.SECONDARY;
      break;
    case 'color':
      element = <ColorImage type={props.value} />;
      bgColor = COLORS.SURFACE;
      break;
    case 'animal':
      element = <AnimalImage type={props.value} />;
      bgColor = COLORS.SURFACE;
      break;
    case 'shape':
      element = <ShapeImage type={props.value} />;
      bgColor = COLORS.SURFACE;
      break;
    default:
      element = null;
      bgColor = COLORS.SURFACE;
  }

  return (
    <View style={styles.containerView}>
      <TouchableOpacity
        style={[styles.button, {backgroundColor: bgColor}]}
        onPress={props.onPress}
        activeOpacity={0.7}>
        {element}
      </TouchableOpacity>
    </View>
  );
}

const BUTTON_SIZE = RFPercentage(16);

const styles = StyleSheet.create({
  containerView: {
    width: '44%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: RFPercentage(1.5),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  numberText: {
    fontSize: FONT.SIZE.BIG,
    fontFamily: FONT.FAMILY,
    color: COLORS.FONT.LIGHT,
  },
});
