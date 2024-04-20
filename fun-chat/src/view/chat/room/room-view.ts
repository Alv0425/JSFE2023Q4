import generateColor from "../../../utils/color-generator";
import { div, form, h2 } from "../../../utils/component/elements";
import Component from "../../../utils/component/component";

class RoomView extends Component {
  private header: Component<HTMLElement>;

  private container: Component<HTMLElement>;

  private form: Component<HTMLElement>;

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
    this.updateStatus(status);
  }

  public updateStatus(status: boolean): void {
    if (status) {
      this.getComponent().classList.add("room_oneline");
    }
  }
}

export default RoomView;
