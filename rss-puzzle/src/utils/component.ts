export type Props<T extends HTMLElement = HTMLElement> = Partial<
  Omit<
    T,
    "className" | "style" | "children" | "tagName" | "dataset" | "classList"
  >
>;

export type Attrs = Partial<Record<string, string>>;

export interface IEventListenerDescription {
  eType: keyof GlobalEventHandlersEventMap;
  handler: EventListenerOrEventListenerObject;
  options?: boolean | EventListenerOptions;
}

class Component<T extends HTMLElement = HTMLElement> {
  protected node: T;

  protected content: (Component | HTMLElement | null)[] = [];

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
    ...content: (Component | HTMLElement | null)[]
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

  public getComponent() {
    return this.node;
  }

  public getContent() {
    return this.content;
  }

  public getChildComponents() {
    return this.childComponents;
  }

  public append(child: Component | HTMLElement | null) {
    if (!child) return;
    if (child instanceof Component) {
      this.node.append(child.getComponent());
      this.content.push(child.getComponent());
      this.childComponents.push(child);
    } else {
      this.node.append(child);
    }
  }

  public appendContent(children: (Component | HTMLElement | null)[]) {
    children.forEach((child) => {
      if (child) this.append(child);
    });
  }

  public setAttribute(key: string, value: string) {
    if (value !== undefined) this.node.setAttribute(key, value);
  }

  public setTextContent(str: string) {
    if (str) this.node.textContent = str;
  }

  public addListener(
    eventType: keyof GlobalEventHandlersEventMap,
    evtHandler: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ) {
    this.node.addEventListener(eventType, evtHandler, options);
    const listenerObj: IEventListenerDescription = {
      eType: eventType,
      handler: evtHandler,
    };
    if (options) listenerObj.options = options;
    this.listeners.push(listenerObj);
  }

  public removeAllListeners() {
    this.listeners.forEach((listener) => {
      if (listener.options) {
        this.node.removeEventListener(
          listener.eType,
          listener.handler,
          listener.options,
        );
      } else {
        this.node.removeEventListener(listener.eType, listener.handler);
      }
    });
  }

  public setStyleAttribute(key: string, value: string) {
    this.node.style.setProperty(key, value);
  }

  public getSize() {
    return {
      width: this.node.clientWidth,
      height: this.node.clientHeight,
    };
  }

  public setBgImage(
    imageUrl: string,
    size: { width: number; height: number },
    position: { left: number; top: number },
  ) {
    if (imageUrl) {
      this.node.style.backgroundImage = `url(${imageUrl})`;
      this.node.style.backgroundSize = `${size.width}px ${size.height}px`;
      this.node.style.backgroundPosition = `${position.left}px ${position.top}px`;
    }
  }

  public clear() {
    this.content.forEach((child) => {
      if (child instanceof Component) {
        child.destroy();
      } else {
        child?.remove();
      }
    });
    this.content = [];
  }

  public destroy() {
    this.clear();
    this.node.remove();
  }
}

export default Component;