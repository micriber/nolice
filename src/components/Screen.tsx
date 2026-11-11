import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import IceBg from './IceBg';
import MascotVisit from './MascotVisit';
import {DecorKey} from '../store/settings';
import {NOL} from '../utils/color';

type Props = {
  tint?: string;
  scene?: DecorKey;
  // Renseigné en jeu : la mascotte rend visite en bas de l'écran de temps en temps, false la fige.
  mascotVisit?: boolean;
  children: React.ReactNode;
};

// Racine d'écran : le décor couvre tout l'écran (y compris derrière la barre
// de statut), le contenu reste dans la zone sûre.
export default function Screen({
  tint = NOL.sky,
  scene,
  mascotVisit,
  children,
}: Props) {
  return (
    <View style={styles.root}>
      <IceBg tint={tint} scene={scene} />
      {mascotVisit !== undefined && <MascotVisit active={mascotVisit} />}
      {/* box-none : la mascotte en visite est derrière le contenu, ses zones vides laissent passer le toucher */}
      <SafeAreaView style={styles.safe} pointerEvents="box-none">
        {children}
      </SafeAreaView>
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
