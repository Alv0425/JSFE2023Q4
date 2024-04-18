import "./not-found-page.css";
import Component from "../../utils/component/component";
import { h2, p } from "../../utils/component/elements";

class NotFoundPage extends Component {
  constructor() {
    super(
      "section",
      ["not-found"],
      {},
      {},
      h2(["not-found__title"], `Not Found`),
      p(["not-found__text"], `The page you were looking for doesn't exist`),
    );
  }
}

const notfound = new NotFoundPage();

export default notfound;
