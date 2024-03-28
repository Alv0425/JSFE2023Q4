import { assertsObjectIsTypeOf } from "../../utils/is-type-of-object";
import ENDPOINTS from "./endpoints";
import { IDriveStatusResponse, driveStatusResponseTemplate, engineStatusResponseTemplate } from "./response-interfaces";

export async function setEngineStatus(id: number, status: "started" | "stopped") {
  const res = await fetch(`${ENDPOINTS.ENGINE}?id=${id}&status=${status}`, { method: "PATCH" });
  if (!res.ok) throw new Error(res.statusText);
  if (res.status !== 200) throw new Error(res.statusText);
  const result: unknown = await res.json();
  assertsObjectIsTypeOf(result, engineStatusResponseTemplate);
  return result;
}

export async function setEngineStatusToDrive(id: number, controller?: AbortController) {
  const res = await fetch(`${ENDPOINTS.ENGINE}?id=${id}&status=drive`, { method: "PATCH", signal: controller?.signal });
  if (res.status !== 200) {
    console.log(res);
    if (res.status === 500) console.log(`Car id=${id} has been stopped suddenly. It's engine was broken down.`);
    return { success: false } as IDriveStatusResponse;
  }
  console.log(`Car id=${id} finished!`);
  const result: unknown = await res.json();
  assertsObjectIsTypeOf(result, driveStatusResponseTemplate);
  return result;
}
