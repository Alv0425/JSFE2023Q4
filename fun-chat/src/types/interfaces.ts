import type { Message } from "../models/message";

export interface IContact {
  isLogined: boolean;
  login: string;
  messages: Message[];
}
