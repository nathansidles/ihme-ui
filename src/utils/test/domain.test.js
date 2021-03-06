import { expect } from 'chai';

import {
  percentOfRange,
  numFromPercent,
  domainFromPercent,
  generateColorDomain,
  isWithinRange,
  ensureWithinRange
} from '../domain';

describe('domain helpers', () => {
  it(`should convert a number within a range
    to it's corresponding percentage of that range`, () => {
    const specs = [
      { input: 10, output: 0, range: [10, 20] },
      { input: 20, output: 1, range: [10, 20] },
      { input: 13, output: 0.3, range: [10, 20] },
      { input: 17, output: 0.7, range: [10, 20] },
      { input: 5, output: -0.5, range: [10, 20] },
      { input: 25, output: 1.5, range: [10, 20] },
      { input: 0, output: 0.5, range: [-100, 100] },
      { input: 50, output: 0.75, range: [-100, 100] },
      { input: -50, output: 0.25, range: [-100, 100] }
    ];

    specs.forEach((spec) => {
      const { input, output, range } = spec;
      expect(percentOfRange(input, range)).to.equal(output);
    });
  });

  it(`should convert a percentage to a number corresponding
    to that percent within a given range`, () => {
    const specs = [
      { input: 0, output: 10, range: [10, 20] },
      { input: 1, output: 20, range: [10, 20] },
      { input: 0.3, output: 13, range: [10, 20] },
      { input: 0.5, output: 15, range: [10, 20] },
      { input: 0.5, output: 0, range: [-20, 20] },
      { input: 0, output: -20, range: [-20, 20] },
      { input: 1, output: 20, range: [-20, 20] }
    ];

    specs.forEach((spec) => {
      const { input, output, range } = spec;
      expect(numFromPercent(input, range)).to.equal(output);
    });
  });

  it(`should take a new data domain, an old data domain,
    an extent within the old data domain, and return an extent within the new data domain`, () => {
    const specs = [
      { oldDomain: [10, 20], newDomain: [25, 40], rangeExtent: [10, 20], expected: [25, 40] },
      { oldDomain: [10, 20], newDomain: [25, 40], rangeExtent: [15, 15], expected: [32.5, 32.5] },
      { oldDomain: [10, 20], newDomain: [0, 100], rangeExtent: [13, 17], expected: [30, 70] },
      { oldDomain: [-10, 0], newDomain: [0, 100], rangeExtent: [-7, -3], expected: [30, 70] },
      { oldDomain: [0, 100], newDomain: [20, 30], rangeExtent: [NaN, 50], expected: [20, 25] }
    ];

    specs.forEach((spec) => {
      const { oldDomain, newDomain, rangeExtent, expected } = spec;
      expect(domainFromPercent(newDomain, oldDomain, rangeExtent)).to.deep.equal(expected);
    });
  });

  it(`turns [min, max] domain into multi-step domain
    that matches cardinality of colors array`, () => {
    const origDomain = [0, 100];
    const colors = Array(5);
    expect(generateColorDomain(colors, origDomain)).to.be.an('array')
      .of.length(5)
      .and.to.deep.equal([0, 25, 50, 75, 100]);
  });

  it('returns [min, max] as color domain when min === max', () => {
    const origDomain = [0, 0];
    const colors = Array(5);
    expect(generateColorDomain(colors, origDomain)).to.be.an('array')
      .of.length(2)
      .and.to.deep.equal([0, 0]);
  });

  it('validates that a number is within a specified range, up to and including bounding', () => {
    const specs = [
      { value: 1990, extent: [1990, 1994], expectation: true },
      { value: 1994, extent: [1990, 1994], expectation: true },
      { value: 1992, extent: [1990, 1994], expectation: true },
      { value: 1989, extent: [1990, 1994], expectation: false },
      { value: 1995, extent: [1990, 1994], expectation: false }
    ];

    specs.forEach((spec) => {
      const { value, extent, expectation } = spec;
      expect(isWithinRange(value, extent)).to.equal(expectation);
    });
  });

  it('returns values within the extent of a specified range', () => {
    const specs = [
      { value: 1990, extent: [1990, 1994], expectation: 1990 },
      { value: 1994, extent: [1990, 1994], expectation: 1994 },
      { value: 1992, extent: [1990, 1994], expectation: 1992 },
      { value: 1989, extent: [1990, 1994], expectation: 1990 },
      { value: 1995, extent: [1990, 1994], expectation: 1994 },
      { value: 1995, extent: [], expectation: 1995 }
    ];

    specs.forEach((spec) => {
      const { value, extent, expectation } = spec;
      expect(ensureWithinRange(value, extent)).to.equal(expectation);
    });
  });
});
