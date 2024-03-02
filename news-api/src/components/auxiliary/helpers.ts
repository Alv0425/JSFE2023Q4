import { TypeOfAncestor, ResponseSources, ResponseNews } from './interfaces';

export function assertsElementIs<T>(ancestor: TypeOfAncestor<T>, element: unknown): asserts element is T {
    if (element === null) throw new Error(`element is null`);
    if (!(element instanceof ancestor)) throw new Error(`${element} is not instance of ${ancestor}`);
}

export function getElementOfType<T extends Node | Element | Document | EventTarget>(
    ancestor: TypeOfAncestor<T>,
    element: Node | Element | EventTarget | null
): T {
    assertsElementIs<T>(ancestor, element);
    return element;
}

type KeyValuePairs = Record<string, string>;

export function isResponseNews(res: ResponseNews | ResponseSources): res is ResponseNews {
    return typeof res === 'object' && res !== undefined && res !== null && 'status' in res && 'articles' in res;
}

export function isResponseSources(res: ResponseNews | ResponseSources): res is ResponseSources {
    return typeof res === 'object' && res !== null && res !== undefined && 'status' in res && 'sources' in res;
}

export function createNode<T extends keyof HTMLElementTagNameMap>(
    type: T,
    classname?: string[],
    attributes?: KeyValuePairs
): HTMLElementTagNameMap[T] {
    const newElement = document.createElement(type);
    if (classname) {
        newElement.classList.add(...classname);
    }
    if (attributes) {
        for (const key in attributes) {
            newElement.setAttribute(key, attributes[key]);
        }
    }
    return newElement;
}

export function clearNode(node: HTMLElement) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}
