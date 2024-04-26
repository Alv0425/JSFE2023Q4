import { assertsObjectIsTypeOf } from "../../utils/is-type-of-object";
import ENDPOINTS from "./endpoints";
import type { IWinnerResponse } from "../../types/response-interfaces";
import { winnerResponseTemplate } from "../../types/response-interfaces";

async function updateWinner({ id, wins, time }: IWinnerResponse): Promise<IWinnerResponse> {
  const response: Response = await fetch(`${ENDPOINTS.WINNERS}/${id}`, {
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
