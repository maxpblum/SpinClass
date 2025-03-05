import { makeTempoScheduler } from '../../src/tempo/scheduler.js';

describe('makeTempoScheduler', () => {
  it('emits no events when time has not started yet', () => {
    const scheduler = makeTempoScheduler();
    expect(scheduler({ paused: false, elapsed: -1 })).toBeNull();
    expect(scheduler({ paused: false, elapsed: -1 })).toBeNull();
  });

  it('emits the latest tempo change whose time is <= the new time', () => {
    const scheduler = makeTempoScheduler();
    expect(scheduler({ paused: false, elapsed: 1000 })!.newTempoBpm).toEqual(
      60,
    );
  });

  it('does not emit the same tempo change more than once', () => {
    const scheduler = makeTempoScheduler();
    scheduler({ paused: false, elapsed: 1000 });
    expect(scheduler({ paused: false, elapsed: 1000 })).toBeNull();
  });

  it('emits subsequent tempo changes after emitting earlier ones', () => {
    const scheduler = makeTempoScheduler();
    scheduler({ paused: false, elapsed: 1000 });
    expect(scheduler({ paused: false, elapsed: 2000 })!.newTempoBpm).toEqual(
      70,
    );
  });
});
