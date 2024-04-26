export type Props<T extends HTMLElement = HTMLElement> = Partial<
  Omit<T, "className" | "style" | "children" | "tagName" | "dataset" | "classList">
>;

export type Attrs = Partial<Record<string, string>>;

export interface IEventListenerDescription {
  eType: keyof GlobalEventHandlersEventMap;
  handler: EventListenerOrEventListenerObject;
  options?: boolean | EventListenerOptions;
}

export type ComponentType = Component | HTMLElement | null | SVGSVGElement;

class Component<T extends HTMLElement = HTMLElement> {
  protected node: T;

  protected content: (Component | HTMLElement | SVGSVGElement | null)[] = [];

  protected childComponents: Component[] = [];

  protected listeners: {
    eType: keyof GlobalEventHandlersEventMap;
    handler: EventListenerOrEventListenerObject;
    options?: boolean | EventListenerOptions;
  }[] = [];

  public constructor(
    type: keyof HTMLElementTagNameMap,
    classNames?: string[],
    props?: Props<T>,
    attrs?: Attrs,
    ...content: (Component | HTMLElement | SVGSVGElement | null)[]
  ) {
    this.node = document.createElement(type) as T;
    if (classNames) {
      classNames.forEach((className) => {
        this.node.classList.add(className);
      });
    }
    if (props) {
      Object.assign(this.node, props);
    }
    if (attrs) {
      Object.keys(attrs).forEach((key) => {
        const value = attrs[key];
        if (value) {
          this.node.setAttribute(key, value);
        }
      });
    }
    if (content) {
      this.appendContent(content);
    }
  }

  public getComponent(): T {
    return this.node;
  }

  public append(child: ComponentType): void {
    if (!child) {
      return;
    }
    if (child instanceof Component) {
      this.node.append(child.getComponent());
      this.content.push(child.getComponent());
      this.childComponents.push(child);
    } else {
      this.node.append(child);
    }
  }

  public appendContent(children: (Component | HTMLElement | null | SVGSVGElement)[]): void {
    children.forEach((child) => {
      if (child) {
        this.append(child);
      }
    });
  }

  public setAttribute(key: string, value: string): void {
    if (value !== undefined) {
      this.node.setAttribute(key, value);
    }
  }

  public setTextContent(str: string): void {
    if (str) {
      this.node.textContent = str;
    }
  }

  public addListener(
    eventType: keyof GlobalEventHandlersEventMap,
    evtHandler: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void {
    this.node.addEventListener(eventType, evtHandler, options);
    const listenerObj: IEventListenerDescription = {
      eType: eventType,
      handler: evtHandler,
    };
    if (options) {
      listenerObj.options = options;
    }
    this.listeners.push(listenerObj);
  }

  public clear(): void {
    this.content.forEach((child) => {
      if (child instanceof Component) {
        child.destroy();
      } else {
        child?.remove();
      }
    });
    this.content = [];
    this.clearAll();
  }

  public destroy(): void {
    this.clear();
    this.node.remove();
  }

  public clearContainer(): void {
    this.content = [];
    this.clearAll();
  }

  public clearAll(): void {
    while (this.node.firstChild) {
      this.node.removeChild(this.node.firstChild);
    }
  }
}

export default Component;
