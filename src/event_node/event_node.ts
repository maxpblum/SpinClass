export interface EventProcessorOutputs<State, SideEffect, OutputEvent> {
  newState: State;
  sideEffects: Iterable<SideEffect>;
  outputEvents: Iterable<OutputEvent>;
}

export interface EventProcessor<InputEvent, State, SideEffect, OutputEvent> {
  (event: InputEvent): EventProcessorOutputs<State, SideEffect, OutputEvent>;
}

export interface SideEffectDoer<S> {
  (s: S): void;
}

export interface EventNodeConstructorArgs<
  InputEvent,
  State,
  SideEffect,
  OutputEvent,
> {
  processor: EventProcessor<InputEvent, State, SideEffect, OutputEvent>;
  sideEffectDoer: SideEffectDoer<SideEffect>;
  initialState: StateType;
}

export class EventNode<InputEvent, State, SideEffect, OutputEvent> {
  private readonly processor: EventProcessor<
    InputEvent,
    State,
    SideEffect,
    OutputEvent
  >;
  private readonly sideEffectDoer: SideEffectDoer<SideEffect>;
  private state: StateType;

  constructor(
    a: EventNodeConstructorArgs<InputEvent, State, SideEffect, OutputEvent>
  ) {
    this.processor = a.processor;
    this.sideEffectDoer = a.sideEffectDoer;
    this.state = a.initialState;
  }

  logAThing() {
    console.log("A thing");
  }
}

export function logAThing() {
  console.log("A thing");
}
