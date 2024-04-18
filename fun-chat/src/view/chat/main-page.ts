import Component from "../../utils/component/component";
import { button, h2, p } from "../../utils/component/elements";

class AboutContainer extends Component {
  constructor() {
    super("section", ["about"], {}, {}, h2(["about__title"], `About`), p(["about__text"], `some text`));
    const backButton = button(["about__button"], "BACK");
    backButton.addListener("click", () => {
      window.history.back();
    });
    this.append(backButton);
  }
}

export default AboutContainer;
