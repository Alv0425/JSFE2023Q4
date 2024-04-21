import Component, { type Props } from "./component";

export const div = (classList: string[], ...children: (Component | HTMLElement | null | SVGSVGElement)[]): Component =>
  new Component("div", classList, {}, {}, ...children);

export const p = (classList: string[], textContent: string): Component =>
  new Component("p", classList, { textContent });

export const h1 = (classList: string[], textContent: string): Component =>
  new Component("h1", classList, { textContent });

export const h2 = (classList: string[], textContent: string): Component =>
  new Component("h2", classList, { textContent });

export const h3 = (classList: string[], textContent: string): Component =>
  new Component("h3", classList, { textContent });
export const a = (classList: string[], textContent: string, href: string): Component =>
  new Component("a", classList, { textContent }, { href });

export const button = (
  classList: string[],
  text: string,
  ...children: (Component | HTMLElement | SVGSVGElement | null)[]
): Component<HTMLButtonElement> => {
  const btn = new Component<HTMLButtonElement>("button", classList, {}, {});
  btn.setTextContent(text);
  btn.appendContent(children);
  btn.setAttribute("type", "button");
  return btn;
};

export const input = (classList: string[], props: Props<HTMLInputElement>): Component<HTMLInputElement> =>
  new Component<HTMLInputElement>("input", classList, props);

export const label = (classList: string[], idLabel: string, textContent = ""): Component =>
  new Component<HTMLLabelElement>(
    "label",
    classList,
    {
      textContent,
    },
    { for: idLabel },
  );

export const form = (classList: string[]): Component => {
  const formComponent = new Component<HTMLInputElement>("form", classList);
  formComponent.setAttribute("action", "");
  return formComponent;
};

export const span = (classList: string[], textContent?: string): Component => {
  const spanComponent = new Component("span", classList);
  if (textContent) {
    spanComponent.getComponent().textContent = textContent;
  }
  return spanComponent;
};

export const pre = (classList: string[], textContent?: string): Component => {
  const spanComponent = new Component("pre", classList);
  if (textContent) {
    spanComponent.getComponent().textContent = textContent;
  }
  return spanComponent;
};

export const li = (
  classList: string[],
  textContent = "",
  ...children: (Component | HTMLElement | null)[]
): Component => {
  const liComponent = new Component("li", classList, {}, {}, ...children);
  if (textContent) {
    liComponent.getComponent().textContent = textContent;
  }
  return liComponent;
};

export const ul = (classList: string[], items?: (Component | HTMLElement)[]): Component => {
  const listComponent = new Component("ul", classList);
  if (items) {
    listComponent.appendContent(items);
  }
  return listComponent;
};

export const svgSprite = (url: string, classname: string, viewbox = "0 0 200 70.72"): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewbox", viewbox);
  svg.classList.add(classname);
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", url);
  svg.append(use);
  return svg;
};
