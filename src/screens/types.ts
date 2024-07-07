import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {FindGameParams} from './menu/types';
import {ScoreScreenParams} from './score/types';

export type StackNavigatorParamList = {
  MainMenu: object;
  GameSelectionMenu: object;
  NumberGame: object;
  FindGame: FindGameParams;
  Score: ScoreScreenParams;
};

export type NavigationProp = NativeStackNavigationProp<StackNavigatorParamList>;
