import "./footer.css";
import Component from "../../../utils/component";
import { a, div, p } from "../../../utils/elements";

class Footer extends Component {
  public constructor() {
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
    this.draw();
  }

  public draw(): void {
    document.body.append(this.getComponent());
  }
}

export default Footer;
