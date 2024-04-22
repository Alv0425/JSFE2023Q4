import "./main.css";
import webSocketClient from "./services/web-socket-client";
import router from "./router/router";
import formhandler from "./services/form-handler";
import chatController from "./controllers/chat-controller";

window.addEventListener("load", () => {
  webSocketClient.init();
  router.init();
  formhandler();
  chatController();
});
