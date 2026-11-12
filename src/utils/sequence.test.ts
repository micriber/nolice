import {PATTERNS, Sequence, SequenceImage, makeSequences} from './sequence';

const ITEMS = {
  animal: ['cat', 'dog', 'duck', 'pig', 'cow', 'owl'],
  shape: ['circle', 'square', 'star', 'heart', 'cross'],
};

const nameOf = (image: SequenceImage) => `${image.kind}:${image.key}`;

// Le motif d'une suite : ses images numérotées dans l'ordre où elles apparaissent.
const patternOf = (sequence: Sequence) => {
  const images = [...sequence.shown, sequence.answer].map(nameOf);
  const seen = [...new Set(images)];
  return images.map((image) => seen.indexOf(image));
};

describe('makeSequences', () => {
  const games = Array.from({length: 200}, () => makeSequences(10, ITEMS));
  const sequences = games.flat();

  it('makes one sequence per question', () => {
    games.forEach((game) => {
      expect(game).toHaveLength(10);
    });
  });

  it('follows a known pattern, the answer being its next image', () => {
    sequences.forEach((sequence) => {
      expect(PATTERNS).toContainEqual(patternOf(sequence));
    });
  });

  it('mixes animals and shapes in every sequence', () => {
    sequences.forEach((sequence) => {
      const kinds = sequence.shown.map((image) => image.kind);

      expect(new Set(kinds).size).toBe(2);
    });
  });

  it('offers four different existing pictures, the answer among them', () => {
    sequences.forEach((sequence) => {
      const choices = sequence.choices.map(nameOf);

      expect(new Set(choices).size).toBe(4);
      expect(choices).toContain(nameOf(sequence.answer));
      sequence.choices.forEach((choice) => {
        expect(ITEMS[choice.kind]).toContain(choice.key);
      });
    });
  });

  it('offers every image of the sequence', () => {
    sequences.forEach((sequence) => {
      const choices = sequence.choices.map(nameOf);

      sequence.shown.forEach((image) => {
        expect(choices).toContain(nameOf(image));
      });
    });
  });

  it('uses every pattern in a game', () => {
    games.forEach((game) => {
      expect(
        new Set(game.map((sequence) => patternOf(sequence).join())).size,
      ).toBe(PATTERNS.length);
    });
  });
});
