import {MaterialCommunityIcons} from '@expo/vector-icons';
import {getAnalytics, logEvent} from '@react-native-firebase/analytics';
import {useNavigation, useRoute} from '@react-navigation/core';
import {StyleSheet, View} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';

import {ScoreScreenRouteProp} from './types';
import PrimaryButton from '../../components/PrimaryButton';
import {SOUNDS, useSoundStore} from '../../store/audio';
import {useGameScoreStore} from '../../store/game';
import COLORS from '../../utils/color';
import {NavigationProp} from '../types';

export default function ScoreScreen() {
  const route = useRoute<ScoreScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const store = useGameScoreStore();
  const soundStore = useSoundStore();
  const maxQuestion = store.questions.length;
  const gameId = route.params.gameId;

  const handleClick = () => {
    navigation.navigate('MainMenu', {});
  };

  const results = store.getResults();
  const isGood = results >= maxQuestion / 2;
  const isPerfect = results === maxQuestion;

  let trophyIcon: 'trophy' | 'emoticon-happy-outline' | 'emoticon-sad-outline';
  let trophyColor: string;
  if (isPerfect) {
    trophyIcon = 'trophy';
    trophyColor = COLORS.ICON;
  } else if (isGood) {
    trophyIcon = 'emoticon-happy-outline';
    trophyColor = COLORS.FONT.SUCCESS;
  } else {
    trophyIcon = 'emoticon-sad-outline';
    trophyColor = COLORS.FONT.ERROR;
  }

  return (
    <SafeAreaView
      style={styles.container}
      onLayout={async () => {
        await logEvent(getAnalytics(), 'score', {
          game_id: gameId,
          results,
          isGood,
          isPerfect,
        });
        await soundStore.play(isGood ? SOUNDS.CONGRATULATION : SOUNDS.RETRY);
      }}>
      <View style={styles.iconArea}>
        <MaterialCommunityIcons
          name={trophyIcon}
          size={RFPercentage(18)}
          color={trophyColor}
        />
      </View>

      <View style={styles.starsArea}>
        <View style={styles.starsRow}>
          {store.questions.map((q, i) => (
            <MaterialCommunityIcons
              key={i}
              name={q.success ? 'star' : 'star-outline'}
              size={RFPercentage(5)}
              color={q.success ? COLORS.ICON : COLORS.PROGRESS.INACTIVE}
            />
          ))}
        </View>
      </View>

      <View style={styles.buttonArea}>
        <PrimaryButton
          icon="replay"
          onPress={handleClick}
          size="large"
          color={COLORS.BUTTON.PRIMARY}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: RFPercentage(3),
    justifyContent: 'center',
  },
  iconArea: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starsArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: RFPercentage(0.5),
  },
  buttonArea: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
