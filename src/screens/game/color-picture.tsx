import React from 'react';
import {View} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

// @ts-expect-error
import Black from '../../../assets/svg/splash-black.svg';
// @ts-expect-error
import Blue from '../../../assets/svg/splash-blue.svg';
// @ts-expect-error
import Brown from '../../../assets/svg/splash-brown.svg';
// @ts-expect-error
import Green from '../../../assets/svg/splash-green.svg';
// @ts-expect-error
import Grey from '../../../assets/svg/splash-grey.svg';
// @ts-expect-error
import Orange from '../../../assets/svg/splash-orange.svg';
// @ts-expect-error
import Pink from '../../../assets/svg/splash-pink.svg';
// @ts-expect-error
import Purple from '../../../assets/svg/splash-purple.svg';
// @ts-expect-error
import Red from '../../../assets/svg/splash-red.svg';
// @ts-expect-error
import Yellow from '../../../assets/svg/splash-yellow.svg';

export function ColorImage({type = 'red'}) {
  let animal;
  switch (type) {
    case 'red':
      animal = <Red />;
      break;
    case 'yellow':
      animal = <Yellow />;
      break;
    case 'brown':
      animal = <Brown />;
      break;
    case 'blue':
      animal = <Blue />;
      break;
    case 'pink':
      animal = <Pink />;
      break;
    case 'green':
      animal = <Green />;
      break;
    case 'black':
      animal = <Black />;
      break;
    case 'purple':
      animal = <Purple />;
      break;
    case 'orange':
      animal = <Orange />;
      break;
    case 'grey':
      animal = <Grey />;
      break;
  }
  return (
    <View
      style={[
        {
          height: RFPercentage(14),
          width: RFPercentage(14),
          marginLeft: RFPercentage(1),
          marginTop: RFPercentage(1),
        },
      ]}>
      {animal}
    </View>
  );
}
