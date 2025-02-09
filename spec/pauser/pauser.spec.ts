import {
  makePauser,
  makeTimeEvent,
  PAUSE_EVENT,
  RESUME_EVENT,
} from '../../src/pauser/pauser.js';

describe('makePauser', () => {
  it('begins paused', () => {
    const pauserFunc = makePauser();
    expect(pauserFunc(makeTimeEvent(123))!.paused).toBeTrue();
  });

  it('ignores elapsed time while first paused', () => {
    const pauserFunc = makePauser();
    // The first upstream time event doesn't count toward elapsed time.
    pauserFunc(makeTimeEvent(100));
    // Passing in a value of 200 after a value of 100 would increment .elapsed by 100 if not paused.
    expect(pauserFunc(makeTimeEvent(200))!.elapsed).toEqual(0);
  });

  it('respects resuming', () => {
    const pauserFunc = makePauser();
    expect(pauserFunc(RESUME_EVENT)!.paused).toBeFalse();
  });

  it('ignores elapsed time from before resuming even after resuming', () => {
    const pauserFunc = makePauser();
    // The first upstream time event doesn't count toward elapsed time.
    pauserFunc(makeTimeEvent(100));
    // Passing in a value of 200 after a value of 100 would increment .elapsed by 100 if not paused.
    pauserFunc(makeTimeEvent(200));
    expect(pauserFunc(RESUME_EVENT)!.elapsed).toEqual(0);
  });

  it('counts elapsed time after resuming', () => {
    const pauserFunc = makePauser();
    // The first upstream time event doesn't count toward elapsed time.
    pauserFunc(makeTimeEvent(100));
    pauserFunc(RESUME_EVENT);
    // Passing in a value of 200 after a value of 100 should increment .elapsed by 100.
    expect(pauserFunc(makeTimeEvent(200))!.elapsed).toEqual(100);
  });

  it('counts multiple elapsed time increments after resuming', () => {
    const pauserFunc = makePauser();
    pauserFunc(makeTimeEvent(100));
    pauserFunc(RESUME_EVENT);
    pauserFunc(makeTimeEvent(200));
    expect(pauserFunc(makeTimeEvent(300))!.elapsed).toEqual(200);
  });

  it('respects pausing after resuming', () => {
    const pauserFunc = makePauser();
    pauserFunc(makeTimeEvent(100));
    pauserFunc(RESUME_EVENT);
    expect(pauserFunc(PAUSE_EVENT)!.paused).toBeTrue();
  });

  it('stops counting elapsed time after resume followed by pause', () => {
    const pauserFunc = makePauser();
    pauserFunc(makeTimeEvent(100));
    pauserFunc(RESUME_EVENT);
    pauserFunc(makeTimeEvent(200));
    pauserFunc(PAUSE_EVENT);
    // Pauser should have incremented at the first time event but not the second.
    expect(pauserFunc(makeTimeEvent(300))!.elapsed).toEqual(100);
  });
});
