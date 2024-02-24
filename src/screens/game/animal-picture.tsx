import {View} from "react-native";
import React from "react";

// @ts-ignore
import Duck from "../../../assets/svg/duck.svg";

export function AnimalImage() {
  return (
    <View style={[
      {
        width: "20%",
        height: "40%",
      }
    ]}>
      <Duck/>
    </View>
  );
}