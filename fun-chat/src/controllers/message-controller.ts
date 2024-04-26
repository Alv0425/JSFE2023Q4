import type { IRequest, IRequestHistory, IRequestSend } from "../models/request";
import MessageType from "../models/message-types";
import AuthController from "./auth-controller";

class MessageController {
  public static currentUserData = AuthController.currentUserData;

  public static getHistory(login: string): IRequestHistory {
    const req: IRequestHistory = {
      id: `USER-HISTORY-${login}`,
      type: MessageType.messageFrom,
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
      type: MessageType.messageSend,
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
      type: MessageType.messageRead,
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
      type: MessageType.messageDelete,
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
      type: MessageType.messageEdit,
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
