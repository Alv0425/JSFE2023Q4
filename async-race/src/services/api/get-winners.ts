import eventEmitter from "../../utils/event-emitter";
import { assertsArrayOfObjectIsTypeOf, assertsObjectIsTypeOf } from "../../utils/is-type-of-object";
import ENDPOINTS from "./endpoints";
import { getCarByID } from "./get-cars";
import {
  ICarResponse,
  IWinnerResponse,
  IWinnersInfoResponse,
  winnerResponseTemplate,
  winnersInfoTemplate,
} from "./response-interfaces";

export async function getWinnerByID(carID: number): Promise<IWinnerResponse> {
  try {
    const res = await fetch(`${ENDPOINTS.WINNERS}/${carID}`);
    if (res.status === 404) eventEmitter.emit("actualize-collection");
    const car: unknown = await res.json();
    assertsObjectIsTypeOf(car, winnerResponseTemplate);
    return car;
  } catch {
    console.log(`The winner with id = ${carID} not found among winners.`);
    return {} as IWinnerResponse;
  }
}

async function getWinners({
  sort,
  order,
}: {
  sort: "id" | "wins" | "time";
  order: "ASC" | "DESC";
}): Promise<IWinnersInfoResponse[]> {
  try {
    const res = await fetch(`${ENDPOINTS.WINNERS}?_sort=${sort}&_order=${order}`);
    if (!res.ok) throw new Error(res.statusText);
    if (res.status !== 200) throw new Error(res.statusText);
    const winnersResults: unknown = await res.json();
    if (!Array.isArray(winnersResults)) throw new Error("Response should be an Array");
    assertsArrayOfObjectIsTypeOf(winnersResults, winnersInfoTemplate);
    const cars: ICarResponse[] = await Promise.all(
      winnersResults.map(async (winner) => {
        const car = await getCarByID(winner.id);
        return car;
      }),
    );
    return winnersResults.map((winner, index) => ({ ...winner, name: cars[index].name, color: cars[index].color }));
  } catch {
    console.log("Failed to fetch. Please, launch the server.");
    return [];
  }
}

export default getWinners;
