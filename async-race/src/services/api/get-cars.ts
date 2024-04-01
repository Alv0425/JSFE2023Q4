import { assertsArrayOfObjectIsTypeOf, assertsObjectIsTypeOf } from "../../utils/is-type-of-object";
import eventEmitter from "../../utils/event-emitter";
import ENDPOINTS from "./endpoints";
import { carResponseTemplate } from "./response-interfaces";

export async function getCarsOnPage(pageNum: number) {
  const res = await fetch(`${ENDPOINTS.GARAGE}?_page=${pageNum}&_limit=7`);
  if (!res.headers.get("X-Total-Count")) {
    throw new Error("No cars on this page!");
  }
  const cars: unknown = await res.json();
  assertsArrayOfObjectIsTypeOf(cars, carResponseTemplate);
  return cars;
}

export async function getCarByID(carID: number) {
  const res = await fetch(`${ENDPOINTS.GARAGE}/${carID}`);
  if (res.status === 404) eventEmitter.emit("actualize-collection");
  const car: unknown = await res.json();
  assertsObjectIsTypeOf(car, carResponseTemplate);
  return car;
}

export async function getAllCars() {
  try {
    const res = await fetch(`${ENDPOINTS.GARAGE}`);
    const cars: unknown = await res.json();
    assertsArrayOfObjectIsTypeOf(cars, carResponseTemplate);
    return cars;
  } catch (e) {
    console.log("Failed to fetch. Please, launch the server.");
    return [];
  }
}
