import { assertsObjectIsTypeOf } from "../../utils/is-type-of-object";
import eventEmitter from "../../utils/event-emitter";
import ENDPOINTS from "./endpoints";
import { IDriveStatusResponse, driveStatusResponseTemplate, engineStatusResponseTemplate } from "./response-interfaces";

export async function setEngineStatus(id: number, status: "started" | "stopped") {
  const res = await fetch(`${ENDPOINTS.ENGINE}?id=${id}&status=${status}`, { method: "PATCH" });
  if (res.status === 404) eventEmitter.emit("actualize-collection");
  if (res.status === 404) console.log(`Car with such id was not found in the garage.`);
  const result: unknown = await res.json();
  assertsObjectIsTypeOf(result, engineStatusResponseTemplate);
  return result;
}

export async function setEngineStatusToDrive(id: number, controller?: AbortController) {
  const res = await fetch(`${ENDPOINTS.ENGINE}?id=${id}&status=drive`, { method: "PATCH", signal: controller?.signal });
  if (res.status !== 200) {
    if (res.status === 500) console.log(`Car has been stopped suddenly. It's engine was broken down.`);
    if (res.status === 429)
      console.log(`Drive already in progress. You can't run drive for the same car twice while it's not stopped.`);
    if (res.status === 404) console.log(`Engine parameters for car with such id was not found in the garage.`);
    if (res.status === 404) eventEmitter.emit("actualize-collection");
    const result = { success: false, status: res.status } as IDriveStatusResponse;
    return result;
  }
  console.log(`Car id=${id} finished!`);
  const result: unknown = await res.json();
  assertsObjectIsTypeOf(result, driveStatusResponseTemplate);
  return result;
}
