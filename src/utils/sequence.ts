import {shuffle} from './array';

export type SequenceKind = 'animal' | 'shape';

export type SequenceImage = {kind: SequenceKind; key: string};

export type Sequence = {
  // Les images montrées, dans l'ordre ; `answer` est celle qui vient après.
  shown: SequenceImage[];
  answer: SequenceImage;
  // Les quatre propositions, mélangées.
  choices: SequenceImage[];
};

// Un motif par ligne : chaque chiffre désigne une image, le dernier est la réponse à trouver.
export const PATTERNS = [
  [0, 1, 0, 1, 0, 1],
  [0, 0, 1, 0, 0, 1],
  [0, 1, 1, 0, 1, 1],
  [0, 1, 2, 0, 1, 2],
];

const CHOICES = 4;
const KINDS: SequenceKind[] = ['animal', 'shape'];

// Par tours complets mélangés : tous les éléments sortent avant qu'un seul ne revienne.
function deal<T>(items: readonly T[], count: number): T[] {
  const dealt: T[] = [];
  while (dealt.length < count) dealt.push(...shuffle([...items]));
  return dealt.slice(0, count);
}

// Les suites d'une partie : motifs mélangés, quatre propositions dont les images du motif.
// Chaque suite mêle animaux et formes : ses deux premières images sont l'une d'une sorte, l'autre de l'autre.
export function makeSequences(
  count: number,
  items: Record<SequenceKind, readonly string[]>,
): Sequence[] {
  const firstKinds = deal(KINDS, count);
  return deal(PATTERNS, count).map((pattern, i) => {
    const left = {
      animal: shuffle([...items.animal]),
      shape: shuffle([...items.shape]),
    };
    const other = KINDS.find((kind) => kind !== firstKinds[i])!;
    const kinds = [firstKinds[i], other, ...deal(KINDS, CHOICES - 2)];
    const drawn = kinds.map((kind) => ({kind, key: left[kind].pop()!}));
    const images = pattern.map((n) => drawn[n]);
    return {
      shown: images.slice(0, -1),
      answer: images[images.length - 1],
      choices: shuffle([...drawn]),
    };
  });
}
