import React from 'react';
import {StyleSheet, View} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

import {Question} from '../store/game';
import COLORS from '../utils/color';

type Props = {
  questions: Question[];
  currentIndex: number;
};

export default function ProgressDots({questions, currentIndex}: Props) {
  return (
    <View style={styles.container}>
      {questions.map((q, i) => {
        let dotStyle;
        if (i < currentIndex) {
          dotStyle = q.success ? styles.success : styles.error;
        } else if (i === currentIndex) {
          dotStyle = styles.current;
        } else {
          dotStyle = styles.inactive;
        }
        return <View key={i} style={[styles.dot, dotStyle]} />;
      })}
    </View>
  );
}

const DOT_SIZE = RFPercentage(1.8);
const CURRENT_DOT_SIZE = RFPercentage(2.6);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: RFPercentage(1),
    paddingVertical: RFPercentage(1),
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  current: {
    width: CURRENT_DOT_SIZE,
    height: CURRENT_DOT_SIZE,
    borderRadius: CURRENT_DOT_SIZE / 2,
    backgroundColor: COLORS.PROGRESS.ACTIVE,
  },
  inactive: {
    backgroundColor: COLORS.PROGRESS.INACTIVE,
  },
  success: {
    backgroundColor: COLORS.PROGRESS.SUCCESS,
  },
  error: {
    backgroundColor: COLORS.PROGRESS.ERROR,
  },
});
