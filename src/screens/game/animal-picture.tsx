import React from 'react';
import {View} from 'react-native';
// @ts-ignore
import {RFPercentage} from 'react-native-responsive-fontsize';

// @ts-ignore
import Bird from '../../../assets/svg/bird.svg';
// @ts-ignore
import Cat from '../../../assets/svg/cat.svg';
// @ts-ignore
import Cow from '../../../assets/svg/cow.svg';
// @ts-ignore
import Dog from '../../../assets/svg/dog.svg';
// @ts-ignore
import Duck from '../../../assets/svg/duck.svg';
// @ts-ignore
import Pig from '../../../assets/svg/pig.svg';
// @ts-ignore
import Rabbit from '../../../assets/svg/rabbit.svg';
// @ts-ignore
import Sheep from '../../../assets/svg/sheep.svg';

export function AnimalImage({type = 'duck'}) {
  let animal;
  switch (type) {
    case 'duck':
      animal = <Duck />;
      break;
    case 'rabbit':
      animal = <Rabbit />;
      break;
    case 'dog':
      animal = <Dog />;
      break;
    case 'pig':
      animal = <Pig />;
      break;
    case 'cow':
      animal = <Cow />;
      break;
    case 'cat':
      animal = <Cat />;
      break;
    case 'bird':
      animal = <Bird />;
      break;
    case 'sheep':
      animal = <Sheep />;
      break;
  }
  return (
    <View
      style={[
        {
          height: RFPercentage(13),
          width: RFPercentage(10),
          flexGrow: 1,
        },
      ]}>
      {animal}
    </View>
  );
}
