import type { IRequestHistory, IRequestSend } from "../models/request";
import AuthController from "./auth-controller";

class MessageController {
  public static currentUserData = AuthController.currentUserData;

  public static getHistory(login: string): IRequestHistory {
    const req: IRequestHistory = {
      id: `USER-HISTORY-${login}`,
      type: "MSG_FROM_USER",
      payload: {
        user: {
          login,
        },
      },
    };
    return req;
  }

  public static sendMessageTo(login: string, text: string): IRequestSend {
    const req = {
      id: `${this.currentUserData.login}_${login}_${crypto.randomUUID()}`,
      type: "MSG_SEND",
      payload: {
        message: {
          to: login,
          text,
        },
      },
    };
    return req;
  }
}

export default MessageController;
