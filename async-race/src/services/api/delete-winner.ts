import ENDPOINTS from "./endpoints";

async function deleteWinnerByID(winnerID: number): Promise<void> {
  try {
    const response: Response = await fetch(`${ENDPOINTS.WINNERS}/${winnerID}`, { method: "DELETE" });
    if (!response.ok) {
      console.log(`Failed to delete winner with ID ${winnerID}`);
    }
  } catch (error) {
    console.log("An error occurred while deleting winner:", error);
  }
}
export default deleteWinnerByID;
