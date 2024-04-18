import "./about-page.css";
import Component from "../../utils/component/component";
import { button, h2, p } from "../../utils/component/elements";
import eventEmitter from "../../utils/event-emitter/event-emitter";
import { EventsMap } from "../../utils/event-emitter/events";

class AboutContainer extends Component {
  constructor() {
    super("section", ["about"], {}, {}, h2(["about__title"], `About`), p(["about__text"], `some text`));
    const backButton = button(["about__button"], "BACK");
    backButton.addListener("click", () => {
      eventEmitter.emit(EventsMap.initial);
      console.log("back");
    });
    this.append(backButton);
  }
}

export default AboutContainer;
