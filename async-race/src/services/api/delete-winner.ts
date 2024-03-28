import ENDPOINTS from "./endpoints";

async function deleteWinnerByID(carID: number) {
  const res: Response = await fetch(`${ENDPOINTS.WINNERS}/${carID}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Cannot delete winner with id ${carID}`);
}

export default deleteWinnerByID;
