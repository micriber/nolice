export function shuffle<T>(arr: T[]): T[] {
  let currentIndex = arr.length;
  while (currentIndex !== 0) {
    // Pick a remaining element
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element
    const temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }
  return arr;
}
