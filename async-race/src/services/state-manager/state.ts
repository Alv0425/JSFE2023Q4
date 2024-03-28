interface IEvent {
  toState: string;

  callbacks: string[];
}

type IState = Record<string, IEvent>;

type IStatesObject = Record<string, IState>;

interface IStateParams {
  currentState: string;

  callbacks: Record<string, (...params: unknown[]) => void | Promise<unknown>>;

  states: IStatesObject;
}

class State {
  currentState: string;

  callbacks: Record<string, (...params: unknown[]) => void | Promise<unknown>>;

  states: IStatesObject;

  constructor(params: IStateParams) {
    this.currentState = params.currentState;
    this.callbacks = params.callbacks;
    this.states = params.states;
  }

  public emit(event: string) {
    try {
      const state = this.states[this.currentState];
      const transition = state[event];
      if (!transition) throw new Error(`cannot find ${state[event]} ${event}`);
      this.currentState = transition.toState;
      transition.callbacks.forEach(async (callbackName) => {
        try {
          await this.callbacks[callbackName].call(this);
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  public getCurrentState() {
    return this.currentState;
  }
}

export default State;
