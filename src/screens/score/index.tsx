import analytics from '@react-native-firebase/analytics';
import {useNavigation, useRoute} from '@react-navigation/core';
import {StyleSheet, View, Text, Image} from 'react-native';

import {ScoreScreenRouteProp} from './types';
import PrimaryButton from '../../components/PrimaryButton';
import {SOUNDS, useSoundStore} from '../../store/audio';
import {useGameScoreStore} from '../../store/game';
import COLORS from '../../utils/color';
import FONT from '../../utils/font';
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
  const congratulationSource = require('../../../assets/congratulation.jpeg');
  const retrySource = require('../../../assets/retry.jpeg');

  let message;
  if (!isGood) {
    message = 'Il y a des erreurs mais je suis sûr que tu peux mieux faire.';
  } else if (isPerfect) {
    message = 'Bravo ! Tu as bien répondu à toutes les questions.';
  } else {
    message = 'Bravo ! Tu as bien répondu à la plupart des questions.';
  }

  return (
    <View
      style={styles.container}
      onLayout={async () => {
        await analytics().logEvent('score', {
          game_id: gameId,
          results,
          isGood,
          isPerfect,
        });
        await soundStore.play(isGood ? SOUNDS.CONGRATULATION : SOUNDS.RETRY);
      }}>
      <View style={styles.header}>
        <Image
          style={styles.image}
          source={isGood ? congratulationSource : retrySource}
        />
      </View>
      <View style={styles.body}>
        <Text style={[styles.score, styles.message]}>{message}</Text>
        <Text style={styles.score}>
          Résultat :{' '}
          <Text
            style={[{color: isGood ? COLORS.FONT.SUCCESS : COLORS.FONT.ERROR}]}>
            {results}
          </Text>{' '}
          / {maxQuestion}
        </Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton name="REJOUER" onPress={handleClick} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: 20,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '90%',
    resizeMode: 'center',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: FONT.SIZE.BASE,
    fontFamily: FONT.FAMILY,
    color: COLORS.FONT.BASE,
  },
  message: {
    marginBottom: '10%',
    fontSize: FONT.SIZE.SMALL,
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
