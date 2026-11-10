import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import IceBg from './IceBg';
import {DecorKey} from '../store/settings';
import {NOL} from '../utils/color';

type Props = {
  tint?: string;
  scene?: DecorKey;
  children: React.ReactNode;
};

// Racine d'écran : le décor couvre tout l'écran (y compris derrière la barre
// de statut), le contenu reste dans la zone sûre.
export default function Screen({tint = NOL.sky, scene, children}: Props) {
  return (
    <View style={styles.root}>
      <IceBg tint={tint} scene={scene} />
      <SafeAreaView style={styles.safe}>{children}</SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
});
