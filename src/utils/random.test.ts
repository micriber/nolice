import {getRandomRangeIntUnique} from './random';

describe('getRandomRangeIntUnique', () => {
  it('draws distinct values inside the range, never the excluded one', () => {
    for (let run = 0; run < 200; run++) {
      const values = getRandomRangeIntUnique(2, 8, 3, 5);

      expect(values).toHaveLength(3);
      expect(new Set(values).size).toBe(3);
      values.forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(2);
        expect(value).toBeLessThanOrEqual(8);
        expect(value).not.toBe(5);
      });
    }
  });

  it('reaches every value of the range', () => {
    const seen = new Set<number>();
    for (let run = 0; run < 200; run++) {
      getRandomRangeIntUnique(0, 9, 3, 4).forEach((value) => seen.add(value));
    }

    expect([...seen].sort()).toEqual([0, 1, 2, 3, 5, 6, 7, 8, 9]);
  });

  it('returns what is left when the range is too short', () => {
    expect(getRandomRangeIntUnique(0, 2, 3, 1).sort()).toEqual([0, 2]);
    expect(getRandomRangeIntUnique(0, 0, 3, 0)).toEqual([]);
    expect(getRandomRangeIntUnique(5, 4, 3, 0)).toEqual([]);
  });
});
