import { EventsMap } from "../../../../utils/event-emitter/events";
import generateColor from "../../../../utils/helpers/color-generator";
import Component from "../../../../utils/component/component";
import { button, div, h2, svgSprite } from "../../../../utils/component/elements";
import eventEmitter from "../../../../utils/event-emitter/event-emitter";

class RoomHeader extends Component {
  constructor(login: string) {
    super("div", ["room__header"], {}, {});
    const back = button(["room__back"], "", svgSprite("./assets/icons/arrow-left-solid.svg#back", "room__button-icon"));
    back.addListener("click", () => eventEmitter.emit(EventsMap.backRoomClicked));
    const circle = div(["room__circle"]);
    circle.setTextContent(login[0]?.toUpperCase() || "");
    circle.setStyleAttribute("background-color", generateColor(login));
    this.appendContent([back, circle, h2(["room__login"], login)]);
  }
}

export default RoomHeader;
