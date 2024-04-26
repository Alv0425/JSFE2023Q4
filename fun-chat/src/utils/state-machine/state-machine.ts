import type { IStateParams, IStatesObject } from "../../types/interfaces";

class StateMachine {
  private currentState: string;

  private callbacks: Record<string, (...params: unknown[]) => void | Promise<unknown>>;

  private states: IStatesObject;

  constructor(params: IStateParams) {
    this.currentState = params.currentState;
    this.callbacks = params.callbacks;
    this.states = params.states;
  }

  public emit(event: string, ...params: unknown[]): void {
    const state = this.states[this.currentState];
    if (!state) {
      console.warn("State is not defined");
      return;
    }
    const transition = state[event];
    if (!transition) {
      console.warn(`Cannot find transition for state "${this.currentState}" at event "${event}"`);
      return;
    }
    this.currentState = transition.toState;
    transition.callbacks.forEach((callbackName) => this.runCallback(callbackName, params));
  }

  private runCallback(callbackName: string, params: unknown[]): void {
    try {
      const callback = this.callbacks[callbackName];
      if (callback) {
        callback.call(this, ...params);
      }
    } catch (error) {
      console.warn(error);
    }
  }
}

export default StateMachine;
