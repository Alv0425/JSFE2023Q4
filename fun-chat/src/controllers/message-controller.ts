import type { IRequest, IRequestHistory, IRequestSend } from "../models/request";
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

  public static setReadMessageStatus(id: string): IRequest {
    const req = {
      id: `MSG_READ_${id}`,
      type: "MSG_READ",
      payload: {
        message: {
          id,
        },
      },
    };
    return req;
  }

  public static deleteMessage(id: string): IRequest {
    const req = {
      id: `MSG_DELETE_${id}`,
      type: "MSG_DELETE",
      payload: {
        message: {
          id,
        },
      },
    };
    return req;
  }

  public static editMessage(text: string, id: string): IRequest {
    const req = {
      id: `MSG_EDIT_${id}`,
      type: "MSG_EDIT",
      payload: {
        message: {
          id,
          text,
        },
      },
    };
    return req;
  }
}

export default MessageController;
