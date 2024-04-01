import Header from "./view/header/header";
import Footer from "./view/footer/footer";
import MainCont from "./view/main/maincontainer";
import Blobs from "./view/background/blobs";
import storage from "./services/localstorage";

class AppView {
  public blobs: Blobs;

  public header: Header;

  public main: MainCont;

  public footer: Footer;

  constructor() {
    this.blobs = new Blobs();
    this.header = new Header();
    this.main = new MainCont();
    this.footer = new Footer();
    storage.checkFirstLoad();
    if (storage.getData().firstName) {
      this.main.drawStartScreen();
    } else {
      this.main.drawLogin();
    }
  }
}

const view = () => new AppView();
export default view;
