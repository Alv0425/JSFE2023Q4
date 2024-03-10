import Header from "./view/header/header";
import Footer from "./view/footer/footer";
import MainCont from "./view/main/maincontainer";
import LoginScreen from "./view/loginscreen/loginscreen";
import Blobs from "./view/background/blobs";

class AppView {
  public blobs: Blobs;

  public header: Header;

  public main: MainCont;

  public footer: Footer;

  public loginScreen: LoginScreen;

  public constructor() {
    this.blobs = new Blobs();
    this.header = new Header();
    this.main = new MainCont();
    this.footer = new Footer();
    this.loginScreen = new LoginScreen();
    console.log(this.header.getComponent());
  }
}

export default AppView;
