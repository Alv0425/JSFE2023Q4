import "./room.css";
import generateColor from "../../../utils/color-generator";
import { button, div, form, h2 } from "../../../utils/component/elements";
import Component from "../../../utils/component/component";

class RoomView extends Component {
  private header: Component<HTMLElement>;

  private container: Component<HTMLElement>;

  private form: Component<HTMLElement>;

  private textField: Component<HTMLElement>;

  private sendButton: Component<HTMLButtonElement>;

  constructor(
    private login: string,
    private status: boolean,
  ) {
    super("div", ["room"], {}, {});
    const circle = div(["room__circle"]);
    circle.setTextContent(login[0]?.toUpperCase() || "");
    circle.setStyleAttribute("background-color", generateColor(login));
    this.header = div(["room__header"], circle, h2(["room__login"], login));
    this.container = div(["room__messages"]);
    this.form = form(["room__form"]);
    this.textField = new Component("textarea", ["room__text-container"]);
    this.sendButton = button(["room__send-button"], "Send");
    this.form.appendContent([this.textField, this.sendButton]);
    this.updateStatus(status);
    this.appendContent([this.header, this.container, this.form]);
  }

  public updateStatus(status: boolean): void {
    if (status) {
      this.getComponent().classList.add("room_oneline");
    }
  }
}

export default RoomView;
