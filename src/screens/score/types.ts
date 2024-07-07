import {RouteProp} from '@react-navigation/core';

import {StackNavigatorParamList} from '../types';

export type ScoreScreenRouteProp = RouteProp<StackNavigatorParamList, 'Score'>;

export type ScoreScreenParams = {
  gameId: string;
};
