import {View} from "react-native";
import React from "react";

// @ts-ignore
import Duck from "../../../assets/svg/duck.svg";

export function AnimalImage() {
  return (
    <View style={[
      {
        flex: 1,
      }
    ]}>
      <Duck/>
    </View>
  );
}