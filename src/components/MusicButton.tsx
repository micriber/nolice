import {MaterialCommunityIcons} from '@expo/vector-icons';
import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import React from 'react';
import {ViewStyle} from 'react-native';

import RoundBtn from './RoundBtn';
import {useSoundStore} from '../store/audio';
import {NOL, shade} from '../utils/color';

type Props = {
  prim?: string;
  size?: number;
  style?: ViewStyle;
};

// Bouton musique : allumé = pastille pleine de couleur avec note,
// coupé = pastille blanche avec note barrée (lisible pour un enfant de 2 ans).
export default function MusicButton({prim = NOL.sky, size = 52, style}: Props) {
  const on = useSoundStore((s) => s.backgroundPlaying);
  const toggleBackground = useSoundStore((s) => s.toggleBackground);
  const iconSize = Math.round(size * 0.44);

  const toggleBackgroundPlaying = () => {
    const playing = toggleBackground();
    void logEvent(getAnalytics(), 'sound', {
      pause: playing ? 'unpause' : 'pause',
    });
  };

  return (
    <RoundBtn
      size={size}
      bg={on ? prim : '#FFFFFF'}
      deep={on ? shade(prim, -0.22) : undefined}
      onPress={toggleBackgroundPlaying}
      style={style}>
      <MaterialCommunityIcons
        name={on ? 'music' : 'music-off'}
        size={iconSize}
        color={on ? '#fff' : NOL.inkSoft}
      />
    </RoundBtn>
  );
}
