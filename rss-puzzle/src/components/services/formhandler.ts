import Component from "../../utils/component";
import { p } from "../../utils/elements";

export class FormHandler {
  public validateName(input: HTMLElement, type: "first name" | "surname"): string[] {
    const errors: string[] = [];
    if (!(input instanceof HTMLInputElement)) return [""];
    if (!/^[a-zA-Z-]+$/.test(input.value))
      errors.push(`The ${type} must consist of letters from the English alphabet and the hyphen ('-') symbol.`);
    const number = type === "first name" ? 3 : 4;
    if (input.value.length < number) errors.push(`The ${type} must be a minimum of ${number} characters.`);
    if (!/^[A-Z]{1}[a-zA-Z-]{1,}$/.test(input.value)) errors.push(`The ${type} should start with a capital letter.`);
    return errors;
  }

  public emitHints(container: Component, hints: string[]) {
    container.clear();
    if (hints.length) {
      const hintComponents: Component[] = [];
      hints.forEach((hint) => {
        if (hint) hintComponents.push(p(["login-form__hint"], hint));
      });
      container.appendContent(hintComponents);
    }
  }
}

const formhandler = () => new FormHandler();

export default formhandler;
