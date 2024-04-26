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
  public currentState: string;

  private callbacks: Record<string, (...params: unknown[]) => void | Promise<unknown>>;

  private states: IStatesObject;

  constructor(params: IStateParams) {
    this.currentState = params.currentState;
    this.callbacks = params.callbacks;
    this.states = params.states;
  }

  public emit(event: string): void {
    try {
      const state = this.states[this.currentState];
      const transition = state[event];
      if (!transition) {
        return;
      }
      this.currentState = transition.toState;
      transition.callbacks.forEach(async (callbackName) => {
        try {
          await this.callbacks[callbackName].call(this);
        } catch (error) {
          console.warn("User aborted all requests");
        }
      });
    } catch (error) {
      console.warn(error);
    }
  }
}

export default State;