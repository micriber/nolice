import {fitScale} from './scale';

describe('fitScale', () => {
  it('keeps the design size on phones', () => {
    expect(fitScale(360, 640)).toBe(1);
    expect(fitScale(412, 915)).toBe(1);
  });

  it('follows the width on a tall screen', () => {
    expect(fitScale(618, 1400)).toBe(1.5);
  });

  it('is held back by the height on a squat screen', () => {
    expect(fitScale(800, 1280)).toBeCloseTo(1.83, 2);
    expect(fitScale(530, 800)).toBeCloseTo(1.14, 2);
  });

  it('fits taller pages with their own design height', () => {
    expect(fitScale(800, 1280, 800)).toBe(1.6);
  });

  it('stops growing at twice the design size', () => {
    expect(fitScale(1280, 2000)).toBe(2);
  });
});
