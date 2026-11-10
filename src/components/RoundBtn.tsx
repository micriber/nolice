import React, {useState} from 'react';
import {Pressable, StyleSheet, View, ViewStyle} from 'react-native';

import {shade} from '../utils/color';

type Props = {
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  size?: number;
  bg?: string;
  deep?: string;
  children: React.ReactNode;
  style?: ViewStyle;
};

const EDGE = 4;
const PRESSED_EDGE = 1;

// Bouton rond « 3D » (réglages, musique, accueil…).
// Les boutons blancs ont une ombre grise neutre, les colorés une nuance de
// leur propre couleur (retour de Bernard sur l'ombre bleutée).
export default function RoundBtn({
  onPress,
  disabled = false,
  accessibilityLabel,
  size = 50,
  bg = '#FFFFFF',
  deep,
  children,
  style,
}: Props) {
  const [down, setDown] = useState(false);
  const d = deep ?? shade(bg, -0.16);
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{disabled}}
      onPressIn={() => {
        if (!disabled) setDown(true);
      }}
      onPressOut={() => {
        setDown(false);
      }}
      style={[
        styles.edge,
        {
          borderRadius: size / 2 + EDGE,
          backgroundColor: d,
          paddingBottom: down && !disabled ? PRESSED_EDGE : EDGE,
          marginTop: down && !disabled ? EDGE - PRESSED_EDGE : 0,
        },
        style,
      ]}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {children}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  edge: {
    elevation: 4,
    alignSelf: 'flex-start',
  },
});
