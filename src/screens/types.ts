import {RouteProp} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {FindGameKey, QuestionConfig} from './game/question-config';
import {ScoreScreenParams} from './score/types';

export type FindGameParams = {
  questionConfig: QuestionConfig[];
  gameType: FindGameKey;
};

export type StackNavigatorParamList = {
  Welcome: undefined;
  Home: undefined;
  Settings: undefined;
  NumberGame: undefined;
  FindGame: FindGameParams;
  SequenceGame: undefined;
  Score: ScoreScreenParams;
};

export type NavigationProp = NativeStackNavigationProp<StackNavigatorParamList>;

export type FindGameScreenRouteProp = RouteProp<
  StackNavigatorParamList,
  'FindGame'
>;
