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

class StateMachine {
  private currentState: string;

  private callbacks: Record<string, (...params: unknown[]) => void | Promise<unknown>>;

  private states: IStatesObject;

  constructor(params: IStateParams) {
    this.currentState = params.currentState;
    this.callbacks = params.callbacks;
    this.states = params.states;
  }

  public setCurrentState(state: string): void {
    this.currentState = state;
  }

  public emit(event: string): void {
    try {
      const state = this.states[this.currentState];
      if (!state) {
        return;
      }
      const transition = state[event];
      if (!transition) {
        return;
      }
      this.currentState = transition.toState;
      transition.callbacks.forEach(async (callbackName) => {
        try {
          await this.callbacks[callbackName]?.call(this);
        } catch (error) {
          console.warn("User aborted all requests");
        }
      });
    } catch (error) {
      console.warn(error);
    }
  }
}

export default StateMachine;
