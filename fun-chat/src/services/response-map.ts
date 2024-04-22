import MessageType from "../models/message-types";
import { EventsMap } from "../utils/event-emitter/events";

const responseMap: Map<MessageType, EventsMap> = new Map([
  [MessageType.login, EventsMap.login],
  [MessageType.logout, EventsMap.logout],
  [MessageType.loginExternal, EventsMap.externalLogin],
  [MessageType.logoutExternal, EventsMap.externalLogout],
  [MessageType.error, EventsMap.error],
  [MessageType.userActive, EventsMap.getActiveUsers],
  [MessageType.userInactive, EventsMap.getInactiveUsers],
  [MessageType.messageFrom, EventsMap.getHistory],
  [MessageType.messageSend, EventsMap.messageSent],
  [MessageType.messageDelivered, EventsMap.messageDelivered],
  [MessageType.messageEdit, EventsMap.messageEdit],
  [MessageType.messageRead, EventsMap.messageRead],
  [MessageType.messageDelete, EventsMap.messageDelete],
]);

export default responseMap;
