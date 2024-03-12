import "./main.css";
import Component from "../../../utils/component";
import LoginScreen from "../loginscreen/loginscreen";
import eventEmitter from "../../../utils/eventemitter";
import StartScreen from "../startscreen/startscreen";

class MainCont extends Component {
  public constructor() {
    super("main", ["main"]);
    document.body.append(this.getComponent());
    eventEmitter.on("logout", () => this.drawLogin());
    eventEmitter.on("login", () => this.drawStartScreen());
    eventEmitter.on("startclicked", () => this.drawMainScreen());
  }

  public drawStartScreen() {
    this.clear();
    document.body.classList.remove("login-screen");
    const startScr = new StartScreen();
    this.append(startScr);
  }

  public drawLogin() {
    this.clear();
    document.body.classList.add("login-screen");
    const loginScr = new LoginScreen();
    this.append(loginScr);
  }

  public drawMainScreen() {
    this.clear();
  }
}
export default MainCont;
