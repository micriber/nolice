import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

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
  let playButtonStyle = styles.playButton;
  const type = props.type;
  switch (type) {
    case 'number':
      element = <Text style={styles.playButtonText}>{props.value}</Text>;
      playButtonStyle = {
        ...playButtonStyle,
        backgroundColor: COLORS.BUTTON.SECONDARY,
      };
      break;
    case 'color':
      element = <ColorImage type={props.value} />;
      playButtonStyle = {...playButtonStyle, backgroundColor: COLORS.FONT.BASE};
      break;
    case 'animal':
      element = <AnimalImage type={props.value} />;
      playButtonStyle = {...playButtonStyle, backgroundColor: '#1e779c'};
      break;
    case 'shape':
      element = <ShapeImage type={props.value} />;
      playButtonStyle = {...playButtonStyle, backgroundColor: COLORS.FONT.BASE};
      break;
    default:
      element = null;
  }

  return (
    <View style={styles.containerView}>
      <TouchableOpacity style={playButtonStyle} onPress={props.onPress}>
        {element}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  containerView: {
    minHeight: '35%',
    minWidth: '35%',
    alignItems: 'center',
  },
  playButton: {
    alignItems: 'center',
    backgroundColor: COLORS.BUTTON.SECONDARY,
    minHeight: 75,
    minWidth: 75,
    maxHeight: 100,
    maxWidth: 100,
    justifyContent: 'center',
    padding: 10,
    borderRadius: 500,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  playButtonText: {
    fontSize: FONT.SIZE.BASE,
    fontFamily: FONT.FAMILY,
    color: COLORS.FONT.BASE,
    marginBottom: 5,
  },
});
