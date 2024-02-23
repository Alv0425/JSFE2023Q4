import { TypeOfAncestor } from './interfaces';

export function isHTMLElement(element: unknown): HTMLElement {
    if (!(element instanceof HTMLElement)) throw new Error(`element is not instance of HTMLElement`);
    return element;
}

export function isElementTypeOf<T>(ancestor: TypeOfAncestor<T>, element: unknown): asserts element is T {
    const [ancestorName] = Object.keys({ ancestor });
    if (element === null) throw new Error(`element is null`);
    if (!(element instanceof ancestor)) throw new Error(`${element} is not instance of ${ancestorName}`);
}

export function getElementOfType<T extends Node | Element | Document>(
    ancestor: TypeOfAncestor<T>,
    element: Node | Element | null
): T {
    isElementTypeOf<T>(ancestor, element);
    return element;
}
