import {MaterialCommunityIcons} from '@expo/vector-icons';
import React from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';

import BigButton from '../../components/BigButton';
import {NOL} from '../../utils/color';
import FONT from '../../utils/font';
import {useScale} from '../../utils/scale';

type Props = {
  title: string;
  hint: string;
  picture: React.ReactNode;
  onClose: () => void;
};

// Fenêtre qui explique comment gagner une récompense encore verrouillée.
export default function UnlockPopup({title, hint, picture, onClose}: Props) {
  const scale = useScale();
  return (
    <Modal
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Pressable sans action : un appui sur la carte ne ferme pas la fenêtre */}
        <Pressable
          style={[
            styles.card,
            {
              maxWidth: 340 * scale,
              borderRadius: 28 * scale,
              padding: 24 * scale,
              gap: 14 * scale,
            },
          ]}>
          {picture}
          <View style={[styles.titleRow, {gap: 8 * scale}]}>
            <MaterialCommunityIcons
              name="lock"
              size={22 * scale}
              color={NOL.inkSoft}
            />
            <Text style={[styles.title, {fontSize: 24 * scale}]}>{title}</Text>
          </View>
          <Text
            style={[
              styles.hint,
              {fontSize: 16 * scale, lineHeight: 23 * scale},
            ]}>
            {hint}
          </Text>
          <BigButton
            label="D’accord"
            color={NOL.sky}
            onPress={onClose}
            scale={scale}
            style={styles.button}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(22,58,85,.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONT.DISPLAY_BOLD,
    color: NOL.ink,
  },
  hint: {
    fontFamily: FONT.UI,
    color: NOL.inkSoft,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
  },
});
