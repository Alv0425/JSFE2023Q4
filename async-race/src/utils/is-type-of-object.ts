type ObjectType = Record<string, unknown>;

function isObject(object: unknown): boolean {
  return (
    typeof object === "object" && object !== null && !Array.isArray(object) && object.constructor.name === "Object"
  );
}

export function isTypeOf<T extends ObjectType>(object: unknown, template: T): boolean {
  if (!isObject(object)) {
    return false;
  }
  return Object.entries(object as ObjectType).every(([key, value]) => {
    if (!(key in template)) {
      return false;
    }
    if (typeof value !== typeof template[key]) {
      return false;
    }
    return true;
  });
}

export function assertsObjectIsTypeOf<T extends ObjectType>(object: unknown, template: T): asserts object is T {
  if (!isTypeOf(object, template)) {
    throw new Error("Invalid data shape!");
  }
}

export function isArrayOfType(
  array: unknown[],
  type: "string" | "boolean" | "function" | "object" | "number",
): boolean {
  if (!Array.isArray(array)) {
    return false;
  }
  return array.every((item) => typeof item === type);
}

export function assertsArrayOfStrings(array: unknown[]): asserts array is string[] {
  if (!isArrayOfType(array, "string")) {
    throw new Error("Invalid data shape!");
  }
}

export function isArrayOfObjectsOfType<T extends ObjectType>(array: unknown, template: T): boolean {
  if (!Array.isArray(array)) {
    throw new Error();
  }
  return array.every((item) => isTypeOf(item, template));
}

export function assertsArrayOfObjectIsTypeOf<T extends ObjectType>(array: unknown, template: T): asserts array is T[] {
  if (!isArrayOfObjectsOfType(array, template)) {
    throw new Error("Invalid data shape!");
  }
}
