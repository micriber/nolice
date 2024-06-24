import {View} from "react-native";
import React from "react";

// @ts-ignore
import Circle from "../../../assets/svg/shape-circle.svg";
// @ts-ignore
import Cross from "../../../assets/svg/shape-cross.svg";
// @ts-ignore
import Heart from "../../../assets/svg/shape-heart.svg";
// @ts-ignore
import Losange from "../../../assets/svg/shape-losange.svg";
// @ts-ignore
import Oval from "../../../assets/svg/shape-oval.svg";
// @ts-ignore
import Rectangle from "../../../assets/svg/shape-rectangle.svg";
// @ts-ignore
import Square from "../../../assets/svg/shape-square.svg";
// @ts-ignore
import Star from "../../../assets/svg/shape-star.svg";
// @ts-ignore
import Triangle from "../../../assets/svg/shape-triangle.svg";
import {RFPercentage} from "react-native-responsive-fontsize";

export function ShapeImage({type = "heart"}) {
  let shape;
  switch (type) {
    case "circle":
      shape = <Circle/>
      break;
    case "cross":
      shape = <Cross/>
      break;
    case "heart":
      shape = <Heart/>
      break;
    case "losange":
      shape = <Losange/>
      break;
    case "oval":
      shape = <Oval/>
      break;
    case "rectangle":
      shape = <Rectangle/>
      break;
    case "square":
      shape = <Square/>
      break;
    case "star":
      shape = <Star/>
      break;
    case "triangle":
      shape = <Triangle/>
      break;
  }
  return (
    <View style={[
      {
        height: RFPercentage(13),
        width:  RFPercentage(10),
        flexGrow: 1,
      }
    ]}>
      {shape}
    </View>
  );
}