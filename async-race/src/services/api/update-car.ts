import { ICarOptions } from "../../components/car/car";
import { assertsObjectIsTypeOf } from "../../utils/is-type-of-object";
import ENDPOINTS from "./endpoints";
import { carResponseTemplate } from "./response-interfaces";

async function updateCar({ name, color, id }: ICarOptions) {
  const response = await fetch(`${ENDPOINTS.GARAGE}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, color }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Cannot update car id=${id} with options ${name}, ${color}`);
  } else {
    const car: unknown = await response.json();
    assertsObjectIsTypeOf(car, carResponseTemplate);
    return car;
  }
}

export default updateCar;
