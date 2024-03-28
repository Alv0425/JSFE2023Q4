import { assertsObjectIsTypeOf } from "../../utils/is-type-of-object";
import ENDPOINTS from "./endpoints";
import { IWinnerResponse, winnerResponseTemplate } from "./response-interfaces";

async function updateWinner({ id, wins, time }: IWinnerResponse) {
  const response = await fetch(`${ENDPOINTS.WINNERS}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ wins, time }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Cannot update winner with ${id}`);
  } else {
    const winner: unknown = await response.json();
    assertsObjectIsTypeOf(winner, winnerResponseTemplate);
    return winner;
  }
}

export default updateWinner;
