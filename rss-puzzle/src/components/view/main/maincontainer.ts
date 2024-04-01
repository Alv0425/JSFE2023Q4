import "./main.css";
import Component from "../../../utils/component";
import LoginScreen from "../loginscreen/loginscreen";
import eventEmitter from "../../../utils/eventemitter";
import StartScreen from "../startscreen/startscreen";
import playboard from "../playboard/playboard";
import statistics from "../statisticspage/statisticspage";

class MainCont extends Component {
  public constructor() {
    super("main", ["main"]);
    document.body.append(this.getComponent());
    eventEmitter.on("logout", () => this.drawLogin());
    eventEmitter.on("login", () => this.drawStartScreen());
    eventEmitter.on("startclicked", () => this.drawMainScreen());
    eventEmitter.on("show-results", () => this.drawStatistics());
    eventEmitter.on("results-continue", () => this.drawMainScreen());
    eventEmitter.on("statistics-page-closed", () => this.drawPlayboard());
  }

  public drawStartScreen(): void {
    this.clear();
    document.body.classList.remove("login-screen");
    const startScr = new StartScreen();
    this.append(startScr);
  }

  public drawLogin(): void {
    this.clear();
    document.body.classList.add("login-screen");
    const loginScr = new LoginScreen();
    this.append(loginScr);
  }

  public async drawMainScreen(): Promise<void> {
    this.getComponent().classList.add("fade-out");
    setTimeout(() => {
      this.clear();
      playboard.startFirstRound();
      this.append(playboard);
      this.getComponent().classList.remove("fade-out");
    }, 300);
  }

  public drawPlayboard(): void {
    statistics.getComponent().remove();
    this.append(playboard);
  }

  public drawStatistics(): void {
    playboard.getComponent().remove();
    this.append(statistics);
  }
}
export default MainCont;
