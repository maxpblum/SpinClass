import {
  NonEmpty,
  LinkedList,
  isEmptyList,
  getHead,
  getTail,
  makeList,
} from '../src/linked_list.js';

describe('isEmptyList', () => {
  it('returns correct values', () => {
    expect(isEmptyList(makeList([]))).toBeTrue();
    expect(isEmptyList(makeList([1]))).toBeFalse();
  });
});

describe('getHead', () => {
  it('returns first element', () => {
    expect(getHead(makeList([1, 2, 3]) as NonEmpty<number>)).toEqual(1);
  });
});

describe('getTail', () => {
  it('returns correct tail', () => {
    expect(getTail(makeList([1, 2, 3]) as NonEmpty<number>)).toEqual(
      makeList([2, 3])
    );
  });
});

describe('makeList', () => {
  it('makes a list correctly', () => {
    expect(makeList([1, 2, 3])).toEqual({
      value: 1,
      tail: { value: 2, tail: { value: 3, tail: null } },
    });
  });
});
