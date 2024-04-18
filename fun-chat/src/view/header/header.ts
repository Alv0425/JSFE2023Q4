import { a, h1 } from "../../utils/component/elements";
import Component from "../../utils/component/component";
import "./header.css";
import eventEmitter from "../../utils/event-emitter/event-emitter";
import { EventsMap } from "../../utils/event-emitter/events";

class Header extends Component {
  private about: Component;

  // private logout: Component<HTMLButtonElement>;

  constructor() {
    super("header", ["header"], {}, {}, h1(["header__logo"], "FUN CHAT"));
    this.about = a(["header__link", "header__link_about"], "about", "./about");
    // this.logout = button(["header__link"], "logout");
    this.about.addListener("click", (event) => {
      event.preventDefault();
      eventEmitter.emit(EventsMap.aboutOpen);
    });
    // this.logout.addListener('click', () => {
    //   eventEmitter.emit(EventsMap.loginOut);
    // });
    this.append(new Component("nav", ["header__nav"], {}, {}, this.about));
  }

  // public about(): void {
  //   //
  // }

  // public login(): void {
  //   //
  // }

  public render(): void {
    document.body.append(this.getComponent());
  }
}

const header = new Header();

export default header;
