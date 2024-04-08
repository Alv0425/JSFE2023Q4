import { ICarResponse, IEngineStatusResponse } from "../../types/response-interfaces";
import Car from "../car/car";

export interface IRaceParticipants {
  carInfo: ICarResponse;
  raceParams: IEngineStatusResponse;
  component: Car;
}
