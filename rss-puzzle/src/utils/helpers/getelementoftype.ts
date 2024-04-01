import Component from "../component";

export interface ITypeOfAncestor<T> {
  new (...params: unknown[]): T;
}
export function assertsElementIs<T>(ancestor: ITypeOfAncestor<T>, element: unknown): asserts element is T {
  if (element === null) throw new Error(`element is null`);
  if (!(element instanceof ancestor)) throw new Error(`${element} is not instance of ${ancestor}`);
}

export function getElementOfType<T extends Node | Element | Component | Document | EventTarget>(
  ancestor: ITypeOfAncestor<T>,
  element: Node | Element | Component | EventTarget | null,
): T {
  assertsElementIs<T>(ancestor, element);
  return element;
}

export function isObject(object: unknown): boolean {
  return (
    typeof object === "object" && object !== null && !Array.isArray(object) && object.constructor.name === "Object"
  );
}
