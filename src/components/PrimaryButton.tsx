import {MaterialCommunityIcons} from '@expo/vector-icons';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import COLORS from '../utils/color';

type IconName = 'play' | 'replay' | 'arrow-right';

type Props = {
  icon: IconName;
  onPress: () => void;
  color?: string;
  size?: 'normal' | 'large';
};

export default function PrimaryButton({
  icon,
  onPress,
  color = COLORS.BUTTON.PRIMARY,
  size = 'normal',
}: Props) {
  const isLarge = size === 'large';
  const buttonSize = isLarge ? RFPercentage(14) : RFPercentage(10);
  const iconSize = isLarge ? RFPercentage(8) : RFPercentage(5);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: color,
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}>
        <MaterialCommunityIcons
          name={icon}
          size={iconSize}
          color={COLORS.FONT.LIGHT}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
});
