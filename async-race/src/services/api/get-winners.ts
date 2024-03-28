import { assertsArrayOfObjectIsTypeOf } from "../../utils/is-type-of-object";
import ENDPOINTS from "./endpoints";
import { getCarByID } from "./get-cars";
import { winnersInfoTemplate } from "./response-interfaces";

async function getWinners(page: number, sort: "id" | "wins" | "time", order: "ASC" | "DESC") {
  const res = await fetch(`${ENDPOINTS.WINNERS}?_page=${page}&_limit=10&_sort=${sort}&_order=${order}`);
  if (!res.ok) throw new Error(res.statusText);
  if (res.status !== 200) throw new Error(res.statusText);
  const winnersResults: unknown = await res.json();
  if (!Array.isArray(winnersResults)) throw new Error();
  if (winnersResults.length) throw new Error();
  assertsArrayOfObjectIsTypeOf(winnersResults, winnersInfoTemplate);
  const winners = winnersResults.map(async (winnerRes) => {
    getCarByID(winnerRes.id);
  });
  return winners;
}

export default getWinners;
