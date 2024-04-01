import { ICarResponse, IEngineStatusResponse } from "../../services/api/response-interfaces";
import Car from "../car/car";

export interface IRaceParticipants {
  carInfo: ICarResponse;
  raceParams: IEngineStatusResponse;
  component: Car;
}
