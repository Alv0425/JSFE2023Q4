import { assertsObjectIsTypeOf } from "../../utils/is-type-of-object";
import ENDPOINTS from "./endpoints";
import { IWinnerResponse, winnerResponseTemplate } from "./response-interfaces";

async function addWinner(options: IWinnerResponse) {
  const response = await fetch(ENDPOINTS.WINNERS, {
    method: "POST",
    body: JSON.stringify(options),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Cannot create winner with options ${options}`);
  } else {
    const winner: unknown = await response.json();
    assertsObjectIsTypeOf(winner, winnerResponseTemplate);
    return winner;
  }
}

export default addWinner;
