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
        p(["footer__year"], "2024"),
        a(["footer__github"], "alv0425", "https://github.com/alv0425"),
        a(["footer__rss"], "", "https://rs.school/js/"),
      ),
    );
  }
}

const chatFooter = new ChatFooter();

export default chatFooter;
