import React, {useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Svg from 'react-native-svg';

type Props = {
  viewBox?: string;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

// Svg étiré sur tout son conteneur. La taille est mesurée et passée en nombres : avec des
// pourcentages, react-native-svg garde l'ancien tracé quand la fenêtre change de taille (pliable qu'on ouvre).
export default function FillSvg({
  viewBox = '0 0 100 100',
  style = StyleSheet.absoluteFill,
  children,
}: Props) {
  const [size, setSize] = useState({width: 0, height: 0});
  return (
    <View
      style={style}
      pointerEvents="none"
      onLayout={({nativeEvent: {layout}}) => {
        setSize({width: layout.width, height: layout.height});
      }}>
      {size.width > 0 && size.height > 0 && (
        <Svg
          width={size.width}
          height={size.height}
          viewBox={viewBox}
          preserveAspectRatio="none">
          {children}
        </Svg>
      )}
    </View>
  );
}
