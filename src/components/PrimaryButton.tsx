import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import COLORS from "../utils/color";
import FONT from "../utils/font";
import {AnimalImage} from "../screens/game/animal-picture";
import React from "react";
import {RFPercentage} from "react-native-responsive-fontsize";
// @ts-ignore
import NumberLogo from "../../assets/svg/logo-number-game.svg";
// @ts-ignore
import ColorLogo from "../../assets/svg/logo-color-game.svg";

export default function PrimaryButton(props: { name: string, onPress: () => void, animal?: string, game?: string}) {
  const logo = props.animal || props.game ?
    <View style={[{flex:1}]}>
      {props.animal ? <AnimalImage type={props.animal} /> : null}
      {props.game == 'number' ? <NumberLogo/> : null}
      {props.game == 'color' ? <ColorLogo/> : null}
    </View> : null;
  return <TouchableOpacity
    style={[styles.playButton, {
      height: RFPercentage(props.animal || props.game ? 14 : 10),
    }]}
    onPress={props.onPress}
  >
    <View style={[styles.buttonContainer]}>
      <View style={[styles.textContainer]}>
        <Text style={styles.playButtonText}>{props.name}</Text>
      </View>
      {logo}
    </View>
  </TouchableOpacity>;
}

const styles = StyleSheet.create({
  playButton: {
    alignItems: 'center',
    backgroundColor: COLORS.BUTTON.PRIMARY,
    justifyContent: 'center',
    borderRadius: 20,
    minWidth: "65%",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    height: RFPercentage(14),
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    maxWidth: "80%",
    marginHorizontal: "3%",
  },
  textContainer: {
    flex: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    fontSize: FONT.SIZE.BASE,
    fontFamily: FONT.FAMILY,
    color: COLORS.FONT.BASE,
  }
});
