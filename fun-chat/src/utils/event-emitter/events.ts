export enum EventsMap {
  loginClick = "login-clicked",
  loginOut = "logout-clicked",
  aboutOpen = "about-opened",
  initial = "initial-page",
  submitLogin = "submit-ligin-form",
}

export type HandlerType<T extends unknown[]> = (...params: T) => void;
