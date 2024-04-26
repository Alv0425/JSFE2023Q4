import { assertsObjectIsTypeOf } from "../../utils/is-type-of-object";
import eventEmitter from "../../utils/event-emitter";
import ENDPOINTS from "./endpoints";
import type { ICarResponse } from "../../types/response-interfaces";
import { carResponseTemplate } from "../../types/response-interfaces";

async function deleteCarByID(carID: number): Promise<ICarResponse> {
  try {
    const response: Response = await fetch(`${ENDPOINTS.GARAGE}/${carID}`, { method: "DELETE" });
    if (response.status === 404) {
      eventEmitter.emit("actualize-collection");
    }
    const car: unknown = await response.json();
    assertsObjectIsTypeOf(car, carResponseTemplate);
    return car;
  } catch (error) {
    console.log("Error occurred while deleting car:", error);
    return { ...carResponseTemplate, error: true };
  }
}

export default deleteCarByID;
