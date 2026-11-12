import {MaterialCommunityIcons} from '@expo/vector-icons';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import MusicButton from '../../components/MusicButton';
import Progress from '../../components/Progress';
import RoundBtn from '../../components/RoundBtn';
import SpeakerOrb from '../../components/SpeakerOrb';
import {GameConfig, NOL} from '../../utils/color';
import FONT from '../../utils/font';
import {useScale} from '../../utils/scale';

type Props = {
  game: GameConfig;
  total: number;
  results: (boolean | undefined)[];
  current: number;
  prompt: string;
  promptSize?: number;
  replayDisabled: boolean;
  onHome: () => void;
};

// Barre du haut (accueil, avancement, musique) + question avec bouton « répéter ».
export default function GameHeader({
  game,
  total,
  results,
  current,
  prompt,
  promptSize = 30,
  replayDisabled,
  onHome,
}: Props) {
  const scale = useScale();
  return (
    <View>
      <View style={[styles.topBar, {gap: 12 * scale}]}>
        <RoundBtn size={46 * scale} onPress={onHome}>
          <MaterialCommunityIcons
            name="home-variant"
            size={24 * scale}
            color={NOL.ink}
          />
        </RoundBtn>
        <View style={styles.progress}>
          <Progress
            total={total}
            results={results}
            current={current}
            dotSize={9 * scale}
          />
        </View>
        <MusicButton prim={game.color} size={46 * scale} />
      </View>
      <View
        style={[styles.promptRow, {gap: 12 * scale, marginTop: 14 * scale}]}>
        <SpeakerOrb
          color={game.deep}
          wave={current}
          disabled={replayDisabled}
          size={58 * scale}
        />
        <Text
          style={[
            styles.prompt,
            {
              fontSize: promptSize * scale,
              lineHeight: 34 * scale,
              maxWidth: 230 * scale,
            },
          ]}
          numberOfLines={2}
          adjustsFontSizeToFit>
          {prompt}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  progress: {
    flex: 1,
    alignItems: 'center',
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  prompt: {
    fontFamily: FONT.DISPLAY,
    color: '#fff',
    textShadowColor: 'rgba(8,30,45,.4)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 7,
  },
});
