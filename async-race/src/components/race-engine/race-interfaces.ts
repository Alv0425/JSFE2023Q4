import type { ICarResponse, IEngineStatusResponse } from "../../types/response-interfaces";
import type Car from "../car/car";

export interface IRaceParticipants {
  carInfo: ICarResponse;
  raceParams: IEngineStatusResponse;
  component: Car;
}
