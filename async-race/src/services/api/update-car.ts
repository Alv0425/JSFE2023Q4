import { assertsObjectIsTypeOf } from "../../utils/is-type-of-object";
import eventEmitter from "../../utils/event-emitter";
import ENDPOINTS from "./endpoints";
import { ICarOptions, ICarResponse, carResponseTemplate } from "../../types/response-interfaces";

async function updateCar({ name, color, id }: ICarOptions): Promise<ICarResponse> {
  try {
    const response: Response = await fetch(`${ENDPOINTS.GARAGE}/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name, color }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 404) eventEmitter.emit("actualize-collection");
    if (!response.ok) {
      throw new Error(`Cannot update car id=${id} with options ${name}, ${color}`);
    } else {
      const car: unknown = await response.json();
      assertsObjectIsTypeOf(car, carResponseTemplate);
      return car;
    }
  } catch {
    console.log("Cannot update car");
    return { ...carResponseTemplate, error: true };
  }
}

export default updateCar;
