import { p } from "../utils/component/elements";
import type Component from "../utils/component/component";
import loginForm from "../view/login-page/login-page";
import eventEmitter from "../utils/event-emitter/event-emitter";
import { EventsMap } from "../utils/event-emitter/events";

class FormHandler {
  constructor(private form = loginForm) {
    this.form.addListener("submit", (e) => {
      e.preventDefault();
      eventEmitter.emit(EventsMap.submitLogin, { login: this.form.getName(), password: this.form.getPassword() });
    });
    this.form.nameInput.addListener("keyup", () => {
      this.form.fillHintsContainerName(this.emitHints(this.validate().errorsName));
    });
    this.form.passwordInput.addListener("keyup", () => {
      this.form.fillHintsContainerPassword(this.emitHints(this.validate().errorsPassword));
    });
    eventEmitter.on(EventsMap.loginError, (error) => {
      setTimeout(() => {
        this.form.fillHintsContainerPassword(this.emitHints([error as string]));
      }, 500);
    });
    eventEmitter.on(EventsMap.login, () => this.form.resetForm());
  }

  public validateName(): string[] {
    const input = this.form.nameInput.getComponent();
    const errors: string[] = [];
    if (!(input instanceof HTMLInputElement)) {
      return [];
    }
    if (!/^[a-zA-Z-]+$/.test(input.value)) {
      errors.push(`The name must consist of letters from the English alphabet and the hyphen ('-') symbol.`);
    }
    if (input.value.length < 3) {
      errors.push(`The name must be a minimum of 3 characters.`);
    }
    return errors;
  }

  public validatePassword(): string[] {
    const input = this.form.passwordInput.getComponent();
    const errors: string[] = [];
    if (!(input instanceof HTMLInputElement)) {
      return [];
    }
    if (!/^(?=.*[0-9]).{1,}$/.test(input.value)) {
      errors.push(`The password must contain a digit from 1 to 9.`);
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z]).{1,}$/.test(input.value)) {
      errors.push(`The password must contain at least one lowercase and uppercase letter (A-Z).`);
    }
    if (input.value.length < 7) {
      errors.push(`The password must contain at least 7 characters.`);
    }
    return errors;
  }

  public emitHints(hints: string[]): Component[] {
    const hintComponents: Component[] = [];
    hints.forEach((hint) => {
      if (hint) {
        hintComponents.push(p(["login-form__hint"], hint));
      }
    });
    return hintComponents;
  }

  public addAuthError(error: string): void {
    this.form.fillHintsContainerPassword(this.emitHints([error]));
  }

  public validate(): { errorsName: string[]; errorsPassword: string[] } {
    const errorsName = this.validateName();
    const errorsPassword = this.validatePassword();
    this.form.submitButton.getComponent().disabled = true;

    if (!errorsName.length && !errorsPassword.length) {
      this.form.submitButton.getComponent().disabled = false;
    }
    return { errorsName, errorsPassword };
  }
}

const formhandler = (): FormHandler => new FormHandler();

export default formhandler;
