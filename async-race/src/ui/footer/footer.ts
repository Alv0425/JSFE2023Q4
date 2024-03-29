import "./footer.css";
import Component from "../../utils/component";
import { a, div, p } from "../../utils/elements";

class Footer extends Component {
  constructor() {
    super(
      "footer",
      ["footer"],
      {},
      {},
      div(
        ["footer__container"],
        p(["footer__year"], "2024"),
        a(["footer__github"], "alv0425", "https://github.com/alv0425"),
        a(["footer__rss"], "", "https://rs.school/js/"),
      ),
    );
  }

  public render() {
    document.body.append(this.getComponent());
  }
}

const footer = new Footer();

export default footer;
