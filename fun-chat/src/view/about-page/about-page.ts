import "./about-page.css";
import Component from "../../utils/component/component";
import { button, h2, p } from "../../utils/component/elements";
import eventEmitter from "../../utils/event-emitter/event-emitter";
import { EventsMap } from "../../utils/event-emitter/events";

class AboutContainer extends Component {
  constructor() {
    super(
      "section",
      ["about"],
      {},
      {},
      h2(["about__title"], `🎉 Welcome to FUN CHAT! 🎉`),
      p(
        ["about__text"],
        `It's a web app that lets you chat with others in real-time. No frameworks, just pure Typescript and WebSockets)`,
      ),
      p(
        ["about__text"],
        `This app was created as part of the assignments for the Rolling Scopes School course, and it proved to be a highly challenging task for me. Despite nearly giving up, I gained invaluable knowledge about real-time communication using WebSockets throughout the process.`,
      ),
      p(["about__text"], `So, enjoy chatting, and let me know if you find any bugs. Have fun! 🚀`),
    );
    const backButton = button(["about__button"], "BACK");
    backButton.addListener("click", () => {
      eventEmitter.emit(EventsMap.initial);
    });
    this.append(backButton);
  }
}

export default AboutContainer;
