import {MaterialCommunityIcons} from '@expo/vector-icons';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {AnimalImage} from './animal-picture';
import {ColorImage} from './color-picture';
import {ShapeImage} from './shape-picture';
import {GameKey, NOL} from '../../utils/color';
import FONT from '../../utils/font';

export type TileState = 'idle' | 'right' | 'wrong' | 'dim';

type Props = {
  type: GameKey;
  value: string;
  deepColor: string;
  state: TileState;
  disabled?: boolean;
  onPress: () => void;
  contentSize: number;
  shapeColor?: string;
};

const EDGE = 6;
const PRESSED_EDGE = 1;

// Carte de réponse blanche : s'enfonce au toucher, puis indique le résultat
// en place (contour vert/rouge + badge, secousse si faux, pop si juste).
export default function Tile({
  type,
  value,
  deepColor,
  state,
  disabled,
  onPress,
  contentSize,
  shapeColor,
}: Props) {
  const [down, setDown] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state === 'wrong') {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 450,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }
    if (state === 'right') {
      anim.setValue(0);
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 240,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 160,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [state]);

  const ring =
    state === 'right' ? NOL.mint : state === 'wrong' ? NOL.coral : null;
  const edgeColor =
    state === 'right'
      ? NOL.mintDeep
      : state === 'wrong'
        ? NOL.coralDeep
        : NOL.iceDeep;

  const transform: any[] = [];
  if (state === 'wrong') {
    transform.push({
      translateX: anim.interpolate({
        inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
        outputRange: [0, -9, 9, -6, 6, 0],
      }),
    });
  }
  if (state === 'right') {
    transform.push({
      scale: anim.interpolate({inputRange: [0, 1], outputRange: [1, 1.08]}),
    });
  }

  let content;
  switch (type) {
    case 'number':
      content = (
        <Text
          style={{
            fontFamily: FONT.DISPLAY_BOLD,
            fontSize: contentSize,
            color: deepColor,
          }}>
          {value}
        </Text>
      );
      break;
    case 'animal':
      content = <AnimalImage type={value} size={contentSize} />;
      break;
    case 'color':
      content = <ColorImage type={value} size={contentSize} />;
      break;
    case 'shape':
      content = (
        <ShapeImage type={value} size={contentSize} color={shapeColor} />
      );
      break;
    default:
      content = null;
  }

  return (
    <Animated.View style={{transform}}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        onPressIn={() => {
          if (!disabled) setDown(true);
        }}
        onPressOut={() => {
          setDown(false);
        }}
        style={[
          styles.edge,
          {
            backgroundColor: edgeColor,
            paddingBottom: down ? PRESSED_EDGE : EDGE,
            marginTop: down ? EDGE - PRESSED_EDGE : 0,
          },
        ]}>
        <View
          style={[
            styles.face,
            ring ? {borderWidth: 4, borderColor: ring} : null,
          ]}>
          <View style={{opacity: state === 'dim' ? 0.35 : 1}}>{content}</View>
        </View>
        {state === 'right' && (
          <View style={[styles.badge, {backgroundColor: NOL.mint}]}>
            <MaterialCommunityIcons name="check-bold" size={20} color="#fff" />
          </View>
        )}
        {state === 'wrong' && (
          <View style={[styles.badge, {backgroundColor: NOL.coral}]}>
            <MaterialCommunityIcons name="close-thick" size={18} color="#fff" />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  edge: {
    borderRadius: 26,
    elevation: 4,
  },
  face: {
    borderRadius: 26,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 5,
  },
});
