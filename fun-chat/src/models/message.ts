import type { IMessageStatus } from "../types/interfaces";
import AuthController from "../controllers/auth-controller";
import MessageView from "../view/chat/message/message-view";
import type { IMessageResponse } from "./response";

class Message {
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
    this.view = new MessageView(this.id, this.content ?? "", this.timestamp, this.sender ?? "", this.status, isMine);
  }

  public updateMessage(messageToCompare: Message): void {
    const cont = messageToCompare.getContent();
    this.content = cont === "" ? this.content : cont;
    const statusToCompare = messageToCompare.getStatus();
    const isReaded = statusToCompare?.isReaded;
    const isDelivered = statusToCompare?.isDelivered;
    const isEdited = statusToCompare?.isEdited;
    const isDeleted = statusToCompare?.isDeleted;
    const newStatus: IMessageStatus = { ...this.status };
    newStatus.isReaded = isReaded ?? newStatus.isReaded;
    newStatus.isDelivered = isDelivered ?? newStatus.isDelivered;
    newStatus.isEdited = isEdited ?? newStatus.isEdited;
    newStatus.isDeleted = isDeleted ?? newStatus.isDeleted;
    this.status = newStatus;
    this.view.updateMessage(this.content ?? "", this.status);
  }

  public remove(): void {
    this.view.destroy();
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

export default Message;
