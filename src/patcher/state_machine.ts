class StateMachine<State, InType, OutType> {
  private state: State;

  constructor(
    initial: State,
    private readonly reducer: (
      state: State,
      input: InType,
    ) => {
      newState: State;
      output: OutType;
    },
  ) {
    this.state = initial;
  }

  iterateAndGetOutput(input: InType): OutType {
    const result = this.reducer(this.state, input);
    this.state = result.newState;
    return result.output;
  }
}

export function makeStateMachine<State, InType, OutType>(
  initial: State,
  reducer: (
    state: State,
    input: InType,
  ) => { newState: State; output: OutType },
): (input: InType) => OutType {
  const machine = new StateMachine<State, InType, OutType>(initial, reducer);
  return (input: InType) => machine.iterateAndGetOutput(input);
}
