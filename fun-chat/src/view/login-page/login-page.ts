import "./login-page.css";
import { button, div, h2, input, label } from "../../utils/component/elements";
import Component from "../../utils/component/component";
// import eventEmitter from "../../utils/event-emitter/event-emitter";
// import { EventsMap } from "../../utils/event-emitter/events";

class LoginScreen extends Component {
  public hintsContainer: {
    name: Component;
    password: Component;
  };

  public submitButton: Component<HTMLButtonElement>;

  public nameInput: Component<HTMLInputElement>;

  public passwordInput: Component<HTMLInputElement>;

  public constructor() {
    super("form", ["login-form"], { id: "login-form" }, { action: "" }, h2(["login-form__title"], "Welcome Back!"));
    this.submitButton = button(["login-form__button"], "Log In");
    this.submitButton.setAttribute("type", "submit");
    this.submitButton.getComponent().disabled = true;
    this.nameInput = input(["login-form__input"], {
      id: "login-name",
      type: "text",
      required: true,
      pattern: "^[a-zA-Z\\-]{3,}$",
    });
    this.passwordInput = input(["login-form__input"], {
      id: "login-password",
      type: "password",
      required: true,
      pattern: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{7,}$",
      autocomplete: "off",
    });
    this.hintsContainer = {
      name: div(["login-form__hints-container"]),
      password: div(["login-form__hints-container"]),
    };
    this.draw();
  }

  public getName(): string {
    return this.nameInput.getComponent().value;
  }

  public getPassword(): string {
    return this.passwordInput.getComponent().value;
  }

  private draw(): void {
    this.appendContent([
      label(["login-form__label"], "login-name", "Login"),
      this.nameInput,
      this.hintsContainer.name,
      label(["login-form__label"], "login-password", "Password"),
      this.passwordInput,
      this.hintsContainer.password,
      this.submitButton,
    ]);
  }

  public fillHintsContainerName(hints: Component[]): void {
    this.hintsContainer.name.clear();
    this.hintsContainer.name.appendContent(hints);
  }

  public fillHintsContainerPassword(hints: Component[]): void {
    this.hintsContainer.password.clear();
    this.hintsContainer.password.appendContent(hints);
  }

  public resetForm(): void {
    this.hintsContainer.name.clear();
    this.hintsContainer.password.clear();
    this.passwordInput.getComponent().value = "";
    this.nameInput.getComponent().value = "";
  }
}

const loginForm = new LoginScreen();

export default loginForm;
