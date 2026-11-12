import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View, ViewStyle} from 'react-native';

import {shade} from '../utils/color';
import FONT from '../utils/font';

type Props = {
  label: string;
  onPress: () => void;
  color: string;
  deep?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  scale?: number;
  style?: ViewStyle;
};

// Gros bouton « 3D » qui s'enfonce quand on appuie (style chunky de la refonte).
// L'épaisseur (EDGE) reste constante : marginTop compense l'enfoncement.
const EDGE = 7;
const PRESSED_EDGE = 2;

export default function BigButton({
  label,
  onPress,
  color,
  deep,
  icon,
  disabled,
  scale = 1,
  style,
}: Props) {
  const [down, setDown] = useState(false);
  const d = deep ?? shade(color, -0.22);
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => {
        setDown(true);
      }}
      onPressOut={() => {
        setDown(false);
      }}
      style={[
        styles.edge,
        {
          borderRadius: 26 * scale,
          backgroundColor: d,
          paddingBottom: down ? PRESSED_EDGE : EDGE,
          marginTop: down ? EDGE - PRESSED_EDGE : 0,
        },
        style,
      ]}>
      <View
        style={[
          styles.face,
          {
            backgroundColor: color,
            borderRadius: 26 * scale,
            paddingVertical: 19 * scale,
            paddingHorizontal: 30 * scale,
          },
        ]}>
        {icon ? <View style={{marginRight: 12 * scale}}>{icon}</View> : null}
        <Text
          style={[styles.label, {fontSize: 23 * scale}]}
          numberOfLines={1}
          adjustsFontSizeToFit>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  edge: {
    elevation: 4,
  },
  face: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: FONT.DISPLAY,
    letterSpacing: 0.3,
    color: '#fff',
  },
});
