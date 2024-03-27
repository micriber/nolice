import {StyleSheet, Text, View} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import React, {useEffect, useState} from "react";
import ChoiceButton from "./ChoiceButton";
import {AnimalImage} from "./animal-picture";
import {MAX_QUESTION, useGameScoreStore} from "../../store/game";
import {ResultModal} from "./result-modal";
import {SOUNDS, useSoundStore} from "../../store/audio";
import {AVPlaybackSource} from "expo-av";
import SoundButton from "../../components/SoundButton";
import COLORS from "../../utils/color";
import FONT from "../../utils/font";
import analytics from "@react-native-firebase/analytics";
import {RFPercentage} from "react-native-responsive-fontsize";

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function ColorGame({ navigation } : Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.header]}>
        <View style={[{
          flex: 1,
          flexDirection: 'row',
        }]}>
          <Text style={{
            fontSize: RFPercentage(4),
            fontFamily: FONT.FAMILY,
            color: COLORS.FONT.BASE,
            flex: 3,
          }}>Question 1 sur 10</Text>
        </View>
        <View style={[ {
          alignContent: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          flexWrap: 'wrap',
          flex: 8,
        }]}>
          <Text style={{
            fontSize: RFPercentage(4),
            fontFamily: FONT.FAMILY,
            color: COLORS.FONT.BASE,
            textAlign: 'center',
          }}>Quelle est la forme que tu viens d'entendre ?</Text>

        </View>
      </View>
      <View style={styles.body}>
        <View style={{
          flexDirection: 'row',
          alignContent: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          flex: 3,
        }}>
          <ChoiceButton key={'carré'} value={'□'} onPress={() => {

          }}/>
          <ChoiceButton key={'rond'} value={'◯'} onPress={() => {

          }}/>
          <ChoiceButton key={'triangle'} value={'△'} onPress={() => {

          }}/>
          <ChoiceButton key={'croix'} value={'☓'} onPress={() => {

          }}/>
        </View>
      </View>
      <View style={[styles.footer]}>
        <SoundButton/>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: 20,
    paddingTop: 40,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  header: {
    flex: 1,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'flex-end',
    flex: 0.2,
    marginTop: -20,
  }
});
