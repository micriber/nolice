import {RouteProp} from '@react-navigation/core';

import {GameKey} from '../../utils/color';
import {StackNavigatorParamList} from '../types';

export type ScoreScreenRouteProp = RouteProp<StackNavigatorParamList, 'Score'>;

export type ScoreScreenParams = {
  gameId: string;
  gameType: GameKey;
};
