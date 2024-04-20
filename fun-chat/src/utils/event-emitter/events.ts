export enum EventsMap {
  login = "login",
  logout = "logout",
  loginOut = "logout-clicked",
  aboutOpen = "about-opened",
  initial = "initial-page",
  submitLogin = "submit-ligin-form",
  getActiveUsers = "get-active-users",
  getInactiveUsers = "get-inactive-users",
  contactsUpdated = "contacts-updated",
  externalLogin = "external-login",
  externalLogout = "external-logout",

  getHistory = "get-history",
  error = "error",
}

export type HandlerType<T extends unknown[]> = (...params: T) => void;
