import MessageType from "../models/message-types";
import type { IRequest } from "../models/request";

class AuthController {
  public static currentUserData = {
    login: "",
    password: "",
  };

  public static error = "";

  public static login(login: string, password: string): IRequest {
    const req: IRequest = {
      id: `LOGIN-${login}`,
      type: MessageType.login,
      payload: {
        user: {
          login,
          password,
        },
      },
    };
    return req;
  }

  public static checkLoginRequestID(id: string): boolean {
    return `LOGIN-${this.currentUserData.login}` === id;
  }

  public static setError(error: string): void {
    this.error = error;
  }

  public static setUserData(login: string, password: string): void {
    this.currentUserData.login = login;
    this.currentUserData.password = password;
  }

  public static logout(): IRequest {
    const req = {
      id: `LOGOUT-${this.currentUserData.login}`,
      type: MessageType.logout,
      payload: {
        user: {
          login: this.currentUserData.login,
          password: this.currentUserData.password,
        },
      },
    };
    return req;
  }

  public static getInactive(): IRequest {
    const req = {
      id: `USERS-INACTIVE-${this.currentUserData.login}`,
      type: MessageType.userInactive,
      payload: null,
    };
    return req;
  }

  public static getActive(): IRequest {
    const req = {
      id: `USERS-ACTIVE-${this.currentUserData.login}`,
      type: MessageType.userActive,
      payload: null,
    };
    return req;
  }
}

export default AuthController;
