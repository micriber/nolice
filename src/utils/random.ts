import {shuffle} from './array';

export function getRandomInt(max: number) {
  // On ajoute +1 parce que le max, n'est pas le max
  // maintenant le max est le vrai.
  // toi meme tu sais
  return Math.floor(Math.random() * max) + 1;
}

export function getRandomRangeIntUnique(
  min: number,
  max: number,
  quantity: number,
  exclude: number,
): number[] {
  const candidates: number[] = [];
  for (let value = min; value <= max; value++) {
    if (value !== exclude) candidates.push(value);
  }
  return shuffle(candidates).slice(0, quantity);
}
