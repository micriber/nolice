export function getRandomInt(max: number) {
  // On ajoute +1 parce que le max, n'est pas le max
  // maintenant le max est le vrai.
  // toi meme tu sais
  return Math.floor(Math.random() * max) + 1;
}

export function getRandomRangeIntUnique(min: number, max: number, quantity: number, exclude: number) {
  if (quantity > (max - min + 1) || (max < min)) {
    return null;
  }
  const randomIntList: number[] = [];
  while (randomIntList.length < quantity) {
    const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!randomIntList.includes(randomInt) && randomInt !== exclude) {
      randomIntList.push(randomInt);
    }
  }

  return randomIntList;
}