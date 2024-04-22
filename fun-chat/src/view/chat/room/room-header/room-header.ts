import generateColor from "../../../../utils/color-generator";
import Component from "../../../../utils/component/component";
import { div, h2 } from "../../../../utils/component/elements";

class RoomHeader extends Component {
  constructor(login: string) {
    super("div", ["room__header"], {}, {});
    const circle = div(["room__circle"]);
    circle.setTextContent(login[0]?.toUpperCase() || "");
    circle.setStyleAttribute("background-color", generateColor(login));
    this.appendContent([circle, h2(["room__login"], login)]);
  }
}

export default RoomHeader;
