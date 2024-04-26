import { assertsObjectIsTypeOf } from "../../utils/is-type-of-object";
import ENDPOINTS from "./endpoints";
import type { IDriveStatusResponse, IEngineStatusResponse } from "../../types/response-interfaces";
import { driveStatusResponseTemplate, engineStatusResponseTemplate } from "../../types/response-interfaces";

export async function setEngineStatus(id: number, status: "started" | "stopped"): Promise<IEngineStatusResponse> {
  try {
    const res: Response = await fetch(`${ENDPOINTS.ENGINE}?id=${id}&status=${status}`, { method: "PATCH" });
    if (res.status === 404) {
      console.log(`Car with such id was not found in the garage.`);
    }
    const result: unknown = await res.json();
    assertsObjectIsTypeOf(result, engineStatusResponseTemplate);
    return result;
  } catch {
    console.log("failed to set engine status");
    return { ...engineStatusResponseTemplate, error: true };
  }
}

export async function setEngineStatusToDrive(id: number, controller?: AbortController): Promise<IDriveStatusResponse> {
  try {
    const res: Response = await fetch(`${ENDPOINTS.ENGINE}?id=${id}&status=drive`, {
      method: "PATCH",
      signal: controller?.signal,
    });
    if (res.status !== 200) {
      if (res.status === 500) {
        console.log(`Car has been stopped suddenly. It's engine was broken down.`);
      }
      if (res.status === 429) {
        console.log(`Drive already in progress. You can't run drive for the same car twice while it's not stopped.`);
      }
      if (res.status === 404) {
        console.log(`Engine parameters for car with such id was not found in the garage.`);
      }
      const result = { success: false, status: res.status } as IDriveStatusResponse;
      return result;
    }
    const result: unknown = await res.json();
    assertsObjectIsTypeOf(result, driveStatusResponseTemplate);
    return result;
  } catch (e) {
    if (e instanceof DOMException) {
      console.log("user aborted request");
    }
    return {
      success: false,
    };
  }
}
