import {toTimeString} from '../../src/clock/clock.js';

describe('toTimeString', () => {
  it('converts timestamps to strings', () => {
    expect(toTimeString(123 * 1000 * 60 + 45 * 1000)).toEqual('123:45');
  });
});
