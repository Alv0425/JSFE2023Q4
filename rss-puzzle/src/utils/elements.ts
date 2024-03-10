import Component, { Props } from "./component";

export const div = (
  classList: string[],
  ...children: (Component | HTMLElement | null)[]
) => new Component("div", classList, {}, {}, ...children);

export const p = (classList: string[], textContent: string) =>
  new Component("p", classList, { textContent });

export const h1 = (classList: string[], textContent: string) =>
  new Component("h1", classList, { textContent });

export const h2 = (classList: string[], textContent: string) =>
  new Component("h2", classList, { textContent });

export const h3 = (classList: string[], textContent: string) =>
  new Component("h3", classList, { textContent });
export const a = (classList: string[], textContent: string, href: string) =>
  new Component("a", classList, { textContent }, { href, target: "_blanc" });

export const button = (
  classList: string[],
  textContent: string = "",
  type: "button" | "submit" | "reset" | undefined = "button",
  id?: string,
) =>
  new Component<HTMLButtonElement>("button", classList, {
    textContent,
    type,
    id,
  });

export const input = (classList: string[], props: Props<HTMLInputElement>) =>
  new Component<HTMLInputElement>("input", classList, props);

export const label = (
  classList: string[],
  idLabel: string,
  textContent: string = "",
) =>
  new Component<HTMLLabelElement>(
    "label",
    classList,
    {
      textContent,
    },
    { for: idLabel },
  );

export const form = (classList: string[], id?: string) => {
  const formComponent = new Component<HTMLInputElement>(
    "input",
    classList,
    {},
    { id },
  );
  formComponent.setAttribute("action", "");
  return formComponent;
};

export const span = (classList: string[], textContent?: string) => {
  const spanComponent = new Component("span", classList);
  if (textContent) spanComponent.getComponent().textContent = textContent;
  return spanComponent;
};

export const li = (
  classList: string[],
  textContent: string = "",
  ...children: (Component | HTMLElement | null)[]
) => {
  const liComponent = new Component("li", classList, {}, {}, ...children);
  if (textContent) liComponent.getComponent().textContent = textContent;
  return liComponent;
};

export const ul = (
  classList: string[],
  items?: (Component | HTMLElement)[],
) => {
  const listComponent = new Component("ul", classList);
  if (items) listComponent.appendContent(items);
  return listComponent;
};
