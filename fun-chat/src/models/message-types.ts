enum MessageType {
  login = "USER_LOGIN",
  logout = "USER_LOGOUT",
  loginExternal = "USER_EXTERNAL_LOGIN",
  logoutExternal = "USER_EXTERNAL_LOGOUT",
  userActive = "USER_ACTIVE",
  userInactive = "USER_INACTIVE",
  messageSend = "MSG_SEND",
  messageFrom = "MSG_FROM_USER",
  messageDelivered = "MSG_DELIVER",
  messageEdit = "MSG_EDIT",
  messageRead = "MSG_READ",
  messageDelete = "MSG_DELETE",
  error = "ERROR",
}

export default MessageType;
