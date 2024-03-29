import footer from "./footer/footer";
import header from "./header/header";
import main from "./main/main";

function layout() {
  header.render();
  main.render();
  footer.render();
}

export default layout;
