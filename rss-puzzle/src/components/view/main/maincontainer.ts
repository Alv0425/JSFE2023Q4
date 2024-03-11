import "./main.css";
import Component from "../../../utils/component";
import LoginScreen from "../loginscreen/loginscreen";

class MainCont extends Component {
  public constructor() {
    super("main", ["main"]);
    document.body.append(this.getComponent());
  }

  public drawLogin() {
    const loginScr = new LoginScreen();
    this.append(loginScr);
  }
}
export default MainCont;
