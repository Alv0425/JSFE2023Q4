export type Props<T extends HTMLElement = HTMLElement> = Partial<
  Omit<T, "className" | "style" | "children" | "tagName" | "dataset" | "classList">
>;

export type Attrs = Partial<Record<string, string>>;

export type ContentType = Component | HTMLElement | SVGSVGElement | null;

export interface IEventListenerDescription {
  eType: keyof GlobalEventHandlersEventMap;
  handler: EventListenerOrEventListenerObject;
  options?: boolean | EventListenerOptions;
}

export interface IComponentSize {
  width: number;
  height: number;
}

export interface IComponentCoordinates {
  x: number;
  y: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

class Component<T extends HTMLElement = HTMLElement> {
  protected node: T;

  protected content: ContentType[] = [];

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

  public getContent(): ContentType[] {
    return this.content;
  }

  public getChildComponents(): Component[] {
    return this.childComponents;
  }

  public append(child: ContentType): void {
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

  public appendContent(children: ContentType[]): void {
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

  public removeListenerOfType(type: string): void {
    this.listeners.forEach((listener) => {
      if (listener.eType === type) {
        if (listener.options) {
          this.node.removeEventListener(listener.eType, listener.handler, listener.options);
        } else {
          this.node.removeEventListener(listener.eType, listener.handler);
        }
      }
    });
  }

  public removeAllListeners(): void {
    this.listeners.forEach((listener) => {
      if (listener.options) {
        this.node.removeEventListener(listener.eType, listener.handler, listener.options);
      } else {
        this.node.removeEventListener(listener.eType, listener.handler);
      }
    });
  }

  public setStyleAttribute(key: string, value: string): void {
    this.node.style.setProperty(key, value);
  }

  public removeStyleAttribute(key: string): void {
    this.node.style.removeProperty(key);
  }

  public getSize(): IComponentSize {
    return {
      width: this.node.clientWidth,
      height: this.node.clientHeight,
    };
  }

  public getCoordinates(): IComponentCoordinates {
    const clientRect = this.getComponent().getBoundingClientRect();
    return {
      x: clientRect.left,
      y: clientRect.top,
      centerX: clientRect.left + clientRect.width / 2,
      centerY: clientRect.top + clientRect.height / 2,
      width: clientRect.width,
      height: clientRect.height,
    };
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
