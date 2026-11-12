import type {MaterialCommunityIcons} from '@expo/vector-icons';
import type {ComponentProps} from 'react';

import {NOL} from './color';
import type {MusicTrackKey} from '../store/settings';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

// Un pictogramme par musique : l'enfant la reconnaît sans lire son nom.
export const TRACK_CHOICES: {
  key: MusicTrackKey;
  label: string;
  icon: IconName;
  color: string;
}[] = [
  {
    key: 'joyeuse',
    label: 'Joyeuse',
    icon: 'white-balance-sunny',
    color: NOL.amber,
  },
  {key: 'calme', label: 'Calme', icon: 'weather-night', color: NOL.violet},
  {key: 'aventure', label: 'Aventure', icon: 'rocket-launch', color: NOL.teal},
  {key: 'festive', label: 'Festive', icon: 'party-popper', color: NOL.coral},
];
