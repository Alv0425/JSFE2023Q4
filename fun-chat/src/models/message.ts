import AuthController from "../controllers/auth-controller";
import MessageView from "../view/chat/message/message-view";
import type { IMessageResponse } from "./response";

export interface IMessage {
  id: string;
  sender?: string;
  receiver?: string;
  content?: string;
  timestamp?: Date;
}

export interface IMessageStatus {
  isDelivered?: boolean | undefined;
  isReaded?: boolean | undefined;
  isEdited?: boolean | undefined;
  isDeleted?: boolean | undefined;
}

export class Message {
  private id: string;

  private sender: string | undefined;

  private receiver: string | undefined;

  private content: string | undefined;

  private timestamp: Date | undefined;

  private status: IMessageStatus | undefined;

  private view: MessageView;

  constructor(params: IMessageResponse) {
    this.id = params.id;
    this.sender = params.from;
    this.receiver = params.to;
    this.content = params.text;
    this.timestamp = params.datetime ? new Date(params.datetime) : new Date();
    this.status = params.status;
    const isMine = AuthController.currentUserData.login === this.sender;
    this.view = new MessageView(this.content ?? "", this.timestamp, this.sender ?? "", this.status, isMine);
  }

  public updateMessage(messageToCompare: Message): void {
    this.content = messageToCompare.getContent();
    this.status = messageToCompare.getStatus();
    this.view.updateMessage(this.content, this.status);
  }

  public getSender(): string {
    return this.sender || "";
  }

  public getReciever(): string {
    return this.receiver || "";
  }

  public getStatus(): IMessageStatus | undefined {
    return this.status;
  }

  public getContent(): string {
    return this.content ?? "";
  }

  public getId(): string {
    return this.id;
  }

  public getView(): MessageView {
    return this.view;
  }
}
