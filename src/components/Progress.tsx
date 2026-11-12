import React from 'react';
import {StyleSheet, View} from 'react-native';

import {NOL} from '../utils/color';

type Props = {
  total: number;
  results: (boolean | undefined)[];
  current: number;
  dotSize?: number;
};

// Pastilles d'avancement : vert/rouge pour les questions passées,
// pastille blanche allongée pour la question en cours, blanc 70 % pour
// celles à venir (bien visibles — retour de Bernard).
export default function Progress({
  total,
  results,
  current,
  dotSize = 9,
}: Props) {
  return (
    <View style={[styles.row, {gap: dotSize * (2 / 3)}]}>
      {Array.from({length: total}).map((_, i) => {
        const r = results[i];
        let bg = 'rgba(255,255,255,.7)';
        let width = dotSize;
        if (r === true) bg = NOL.mint;
        else if (r === false) bg = NOL.coral;
        if (i === current) {
          bg = '#fff';
          width = dotSize * (22 / 9);
        }
        return (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: bg,
              },
              i === current && styles.currentDot,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    elevation: 2,
  },
  currentDot: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,.4)',
  },
});
