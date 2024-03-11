import "./loginscreen.css";
import Component from "../../../utils/component";
import { button, div, h2, input, label } from "../../../utils/elements";
import formhandler, { FormHandler } from "../../services/formhandler";

class LoginScreen extends Component {
  public loginFirstName: Component[] = [];

  public loginSurname: Component[] = [];

  private hintsContainer: Component[] = [];

  private submitButton: Component<HTMLButtonElement>;

  private validator: FormHandler;

  private firstNameStatus: string[] = [];

  private surnameStatus: string[] = [];

  public constructor() {
    super(
      "form",
      ["login-form"],
      { id: "login-form" },
      { action: "" },
      h2(["login-form__title"], "Welcome Back!"),
    );
    this.submitButton = button(
      ["login-form__button"],
      "Log In",
      "submit",
      "login-submit",
    );
    this.submitButton.getComponent().disabled = true;
    this.hintsContainer = [
      div(["login-form__hints-container"]),
      div(["login-form__hints-container"]),
    ];
    this.draw();
    this.setListener();
    this.setListeners();
    this.validator = formhandler();
  }

  private setListener() {
    this.addListener("submit", (e) => {
      e.preventDefault();
      if (
        this.surnameStatus.length === 0 &&
        this.firstNameStatus.length === 0
      ) {
        console.log("submit");
      }
    });
  }

  private setListeners() {
    const inputFirstName = this.loginFirstName[1];
    inputFirstName.addListener("keyup", () => {
      const inputFirst = inputFirstName.getComponent();
      this.firstNameStatus = this.validator.validateName(
        inputFirst,
        "first name",
      );
      this.validator.emitHints(this.hintsContainer[0], this.firstNameStatus);
      if (this.firstNameStatus.length)
        this.submitButton.getComponent().disabled = true;
      if (this.surnameStatus.length === 0 && this.firstNameStatus.length === 0)
        this.submitButton.getComponent().disabled = false;
    });
    const inputSurname = this.loginSurname[1];
    inputSurname.addListener("keyup", () => {
      const inputSur = inputSurname.getComponent();
      this.surnameStatus = this.validator.validateName(inputSur, "surname");
      this.validator.emitHints(this.hintsContainer[1], this.surnameStatus);
      if (this.surnameStatus.length)
        this.submitButton.getComponent().disabled = true;
      if (this.surnameStatus.length === 0 && this.firstNameStatus.length === 0)
        this.submitButton.getComponent().disabled = false;
    });
  }

  private draw() {
    this.loginSurname = [
      label(["login-form__label"], "surname", "Surname"),
      input(["login-form__input"], {
        type: "text",
        id: "surname",
        value: "",
        placeholder: "Doe...",
        required: true,
        pattern: "[A-Z][a-zA-Z\\-]{3,}",
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
        pattern: "[A-Z][a-zA-Z\\-]{2,}",
      }),
    ];
    this.appendContent([
      div(
        ["login-form__first-name"],
        ...this.loginFirstName,
        this.hintsContainer[0],
      ),
      div(
        ["login-form__last-name"],
        ...this.loginSurname,
        this.hintsContainer[1],
      ),
      this.submitButton,
    ]);
  }
}

export default LoginScreen;
