import Component from "../../utils/component/component";
import chatPage from "../chat/chat-page";
import footer from "../footer/footer";
import header from "../header/header";
import main from "../main/main";
import notfound from "../not-found-page/not-found-page";

class PageWrapper extends Component {
  constructor() {
    super("div", ["wrapper"], {}, {});
  }

  public render(): void {
    this.appendLayout();
    document.body.append(this.getComponent());
  }

  public appendLayout(): void {
    this.clearContainer();
    this.appendContent([header, main, footer]);
  }

  public openAbout(): void {
    this.appendLayout();
    main.openAbout();
  }

  public openMain(): void {
    this.clearContainer();
    this.append(chatPage);
  }

  public openLogin(): void {
    this.appendLayout();
    main.openLogin();
  }

  public openNotFound(): void {
    console.log("not-found");
    this.clearContainer();
    this.append(notfound);
  }
}

const pageWrapper = new PageWrapper();

export default pageWrapper;
