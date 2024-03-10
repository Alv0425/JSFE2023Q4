import "./loginscreen.css";
import Component from "../../../utils/component";
import { button, div, h2, input, label } from "../../../utils/elements";

class LoginScreen extends Component {
  public loginFirstName: Component[] = [];

  public loginSurname: Component[] = [];

  public constructor() {
    super(
      "form",
      ["login-form"],
      {},
      { action: "" },
      h2(["login-form__title"], "Welcome Back!"),
    );
    this.draw();
    this.setListener();
  }

  private setListener() {
    this.addListener("submit", (e) => {
      e.preventDefault();
      console.log("submit");
    });
  }

  public draw() {
    this.loginSurname = [
      label(["login-form__label"], "surname", "Surname"),
      input(["login-form__input"], {
        type: "text",
        id: "surname",
        value: "",
        placeholder: "Doe...",
        required: true,
      }),
    ];
    this.loginFirstName = [
      label(["login-form__label"], "first-name", "First Name"),
      input(["login-form__input"], {
        type: "text",
        id: "first-name",
        value: "",
        placeholder: "John...",
        required: true,
      }),
    ];
    const firstNameCont = div(
      ["login-form__first-name"],
      ...this.loginFirstName,
    );
    const loginSubmitButton = button(
      ["login-form__button"],
      "Log In",
      "submit",
    );
    const surnameCont = div(["login-form__last-name"], ...this.loginSurname);
    this.appendContent([firstNameCont, surnameCont, loginSubmitButton]);
  }
}

export default LoginScreen;
