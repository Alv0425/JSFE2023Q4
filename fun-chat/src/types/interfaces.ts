export interface IMessageStatus {
  isDelivered?: boolean | undefined;
  isReaded?: boolean | undefined;
  isEdited?: boolean | undefined;
  isDeleted?: boolean | undefined;
}

export interface IEvent {
  toState: string;

  callbacks: string[];
}

export type IState = Record<string, IEvent>;

export type IStatesObject = Record<string, IState>;

export interface IStateParams {
  currentState: string;

  callbacks: Record<string, (...params: unknown[]) => void | Promise<unknown>>;

  states: IStatesObject;
}
