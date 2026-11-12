import React from 'react';
import {Image, ImageSourcePropType} from 'react-native';

function rasterAnimal(source: ImageSourcePropType) {
  return function Animal({width, height}: {width: number; height: number}) {
    return (
      <Image
        source={source}
        style={{width, height}}
        resizeMode="contain"
        fadeDuration={0}
      />
    );
  };
}

const Dog = rasterAnimal(require('../../../assets/animals/dog.png'));
const Rabbit = rasterAnimal(require('../../../assets/animals/rabbit.png'));
const Pig = rasterAnimal(require('../../../assets/animals/pig.png'));
const Cow = rasterAnimal(require('../../../assets/animals/cow.png'));
const Bird = rasterAnimal(require('../../../assets/animals/bird.png'));
const Cat = rasterAnimal(require('../../../assets/animals/cat.png'));
const Duck = rasterAnimal(require('../../../assets/animals/duck.png'));
const Sheep = rasterAnimal(require('../../../assets/animals/sheep.png'));
const Owl = rasterAnimal(require('../../../assets/animals/owl.png'));

export const ANIMALS: {[key: string]: React.ComponentType<any>} = {
  duck: Duck,
  rabbit: Rabbit,
  dog: Dog,
  pig: Pig,
  cow: Cow,
  cat: Cat,
  bird: Bird,
  sheep: Sheep,
  owl: Owl,
};

export function AnimalImage({
  type = 'duck',
  size,
}: {
  type?: string;
  size: number;
}) {
  const Animal = ANIMALS[type];
  if (!Animal) return null;
  return <Animal width={size} height={size} />;
}
