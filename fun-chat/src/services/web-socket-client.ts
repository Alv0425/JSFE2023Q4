import { EventsMap } from "../utils/event-emitter/events";
import type { IRequest, IUserRequest } from "../models/request";
import eventEmitter from "../utils/event-emitter/event-emitter";
import AuthController from "../controllers/auth-controller";
// import MessageType from "../models/message-types";
import type { IResponse } from "../models/response";
import storage from "./storage";
import responseMap from "./response-map";
import MessageController from "../controllers/message-controller";
import type { User } from "../models/user";
import MessagesPull from "./messages-pull";
import { Message } from "../models/message";
import waitScreen from "../view/wait-screen/wait-screen";

class WebSocketClient {
  private socket: WebSocket | null = null;

  private reconnectInterval = setInterval(() => {}, 1000);

  private isConnected = false;

  private isTimerRunning = false;

  private isReconnect = false;

  constructor(private url: string) {
    eventEmitter.on(EventsMap.submitLogin, (data) => this.login(data as IUserRequest));
    eventEmitter.on(EventsMap.loginOut, () => this.send(AuthController.logout()));
    eventEmitter.on(EventsMap.login, () => this.getContactsRequest());
    eventEmitter.on(EventsMap.externalLogin, () => this.getContactsRequest());
    eventEmitter.on(EventsMap.externalLogout, () => this.getContactsRequest());
    eventEmitter.on(EventsMap.error, (data) => this.handleError(data as IResponse));
    eventEmitter.on(EventsMap.contactsUpdated, (data) => this.requestHistory(data as User[]));
    eventEmitter.on(EventsMap.getHistory, (data) => this.actualizeMessages(data as IResponse));
    eventEmitter.on(EventsMap.sendMessageCkick, (data) => this.sendMessageTo(data as { login: string; text: string }));
    eventEmitter.on(EventsMap.markMessagesAsRead, (data) => this.sendRequestToSetReadStatus(data as string));
    eventEmitter.on(EventsMap.applyEditMessage, (data) => this.applyEditMessage(data));
    eventEmitter.on(EventsMap.removeMessageClicked, (data) => this.handleMessageRemove(data));
  }

  private addListeners(): void {
    if (!this.socket) {
      return;
    }
    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onclose = this.onClose.bind(this);
    this.socket.onerror = this.onError.bind(this);
  }

  private clearPrewSocket(): void {
    if (!this.socket) {
      return;
    }
    this.socket.onopen = null;
    this.socket.onopen = null;
    this.socket.onmessage = null;
    this.socket.onclose = null;
    this.socket.onerror = null;
  }

  public init(): void {
    this.clearPrewSocket();
    this.socket = new WebSocket(this.url);
    this.addListeners();
  }

  public connect(): void {
    this.init();
    eventEmitter.emit(EventsMap.reconnected);
  }

  private requestHistory(data: User[]): void {
    data.forEach((user) => this.getMessagesRequest(user.getUserInfo().login));
  }

  private actualizeMessages(data: IResponse): void {
    data.payload.messages?.forEach((message) => MessagesPull.addMessage(new Message(message)));
  }

  private handleMessageRemove(data: unknown): void {
    const id = data as string;
    this.send(MessageController.deleteMessage(id));
  }

  private applyEditMessage(data: unknown): void {
    const { text, id } = data as { text: string; id: string };
    this.send(MessageController.editMessage(text, id));
  }

  private login({ login, password }: IUserRequest): void {
    AuthController.setUserData(login, password);
    this.send(AuthController.login(login, password));
  }

  private sendMessageTo(data: { login: string; text: string }): void {
    this.send(MessageController.sendMessageTo(data.login, data.text) as IRequest);
  }

  public sendRequestToSetReadStatus(id: string): void {
    this.send(MessageController.setReadMessageStatus(id));
  }

  private getContactsRequest(): void {
    this.send(AuthController.getInactive());
    this.send(AuthController.getActive());
  }

  private getMessagesRequest(login: string): void {
    this.send(MessageController.getHistory(login) as IRequest);
  }

  private onOpen(): void {
    this.isConnected = true;
    this.isTimerRunning = false;
    waitScreen.close();
    clearInterval(this.reconnectInterval);
    if (storage.isLoggedIn()) {
      this.login(storage.getData().user);
    }
  }

  private onMessage(event: MessageEvent): void {
    const res = JSON.parse(event.data);
    if (responseMap.has(res.type)) {
      eventEmitter.emit(responseMap.get(res.type) as EventsMap, res);
    }
  }

  private handleError(response: IResponse): void {
    const { id, payload } = response;
    if (AuthController.checkLoginRequestID(id || "")) {
      eventEmitter.emit(EventsMap.loginError, payload.error);
      AuthController.setError(payload.error || "");
    }
  }

  private reconnect(): void {
    if (!this.isTimerRunning && !this.isConnected && !this.isReconnect) {
      this.tryToConnect();

      console.log("reconnect");
    }
  }

  private tryToConnect(): void {
    this.isConnected = false;
    waitScreen.openWaitOverlay();
    this.reconnectInterval = setInterval(() => {
      this.isTimerRunning = true;
      this.init();
    }, 3000);
  }

  private onClose(): void {
    if (this.isConnected) {
      this.isReconnect = true;
      eventEmitter.emit(EventsMap.closeConnection);
      this.isConnected = false;
      // console.log(event);
      waitScreen.openWaitOverlay();
      this.reconnectInterval = setInterval(() => this.connect(), 3000);
    }
  }

  private onError(): void {
    console.log("Please, make sure you started the server");
    this.reconnect();
  }

  public send(data: IRequest): void {
    if (!this.socket) {
      return;
    }
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      // Handle error: WebSocket connection not open
    }
  }

  public close(): void {
    if (!this.socket) {
      return;
    }
    this.socket.close();
  }
}

const webSocketClient = new WebSocketClient("ws://localhost:4000");

export default webSocketClient;