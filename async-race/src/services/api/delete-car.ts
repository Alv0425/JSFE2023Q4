import { assertsObjectIsTypeOf } from "../../utils/is-type-of-object";
import eventEmitter from "../event-emitter";
import ENDPOINTS from "./endpoints";
import { carResponseTemplate } from "./response-interfaces";

async function deleteCarByID(carID: number) {
  const res: Response = await fetch(`${ENDPOINTS.GARAGE}/${carID}`, { method: "DELETE" });
  if (res.status === 404) eventEmitter.emit("actualize-collection");
  const car: unknown = await res.json();
  assertsObjectIsTypeOf(car, carResponseTemplate);
  return car;
}

export default deleteCarByID;
