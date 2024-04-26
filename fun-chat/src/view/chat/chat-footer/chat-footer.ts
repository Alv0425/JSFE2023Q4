import Component from "../../../utils/component/component";
import { a, div, p } from "../../../utils/component/elements";

class ChatFooter extends Component {
  constructor() {
    super(
      "footer",
      ["chat__footer"],
      {},
      {},
      div(
        ["footer__container"],
        a(["footer__rss"], "Rolling Scopes School", "https://rs.school/js/"),
        a(["footer__github"], "alv0425", "https://github.com/alv0425"),
        p(["footer__year"], "2024"),
      ),
    );
  }
}

const chatFooter = new ChatFooter();

export default chatFooter;
