import {RouteProp} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AudioSource} from 'expo-audio';

import {StackNavigatorParamList} from '../types';

export type QuestionConfig = {
  key: string;
  label: string;
  sound: AudioSource;
};

export type FindGameParams = {
  questionConfig: QuestionConfig[];
  gameType: string;
};

export type FindGameScreenRouteProp = RouteProp<
  StackNavigatorParamList,
  'FindGame'
>;

export type FindGameScreenNavigationProp = NativeStackNavigationProp<
  StackNavigatorParamList,
  'Score'
>;
