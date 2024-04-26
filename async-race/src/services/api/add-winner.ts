import { assertsObjectIsTypeOf } from "../../utils/is-type-of-object";
import ENDPOINTS from "./endpoints";
import type { IWinnerResponse } from "../../types/response-interfaces";
import { winnerResponseTemplate } from "../../types/response-interfaces";

async function addWinner(options: IWinnerResponse): Promise<IWinnerResponse> {
  try {
    const response: Response = await fetch(ENDPOINTS.WINNERS, {
      method: "POST",
      body: JSON.stringify(options),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Cannot create winner with options ${options}`);
    }
    const winner: unknown = await response.json();
    assertsObjectIsTypeOf(winner, winnerResponseTemplate);
    return winner;
  } catch {
    return { ...winnerResponseTemplate, error: true };
  }
}

export default addWinner;
