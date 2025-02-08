import { makeStateMachine } from '../../src/patcher/state_machine.js';

describe('makeStateMachine', () => {
  it('returns a stateful function', () => {
    const sm = makeStateMachine(0, (sum: number, toAdd: number) => {
      const newSum = sum + toAdd;
      return {
        newState: newSum,
        output: newSum,
      };
    });
    expect(sm(1)).toEqual(1);
    expect(sm(5)).toEqual(6);
    expect(sm(-3)).toEqual(3);
  });
});
