export interface IWinnersInfo {
  id: number;
  wins: number;
  time: number;

  [key: string]: unknown;
}

export interface ICarResponse {
  name: string;
  color: string;
  id: number;
  [key: string]: unknown;
}

export const carResponseTemplate: ICarResponse = {
  name: "",
  color: "",
  id: 0,
};

export interface IDriveStatusResponse {
  success: boolean;

  status?: number;

  [key: string]: unknown;
}

export const driveStatusResponseTemplate: IDriveStatusResponse = {
  success: true,
};

export interface IEngineStatusResponse {
  velocity: number;
  distance: number;
  [key: string]: unknown;
}

export const engineStatusResponseTemplate: IEngineStatusResponse = {
  velocity: 0,
  distance: 500000,
};

export interface IWinnerResponse {
  id: number;
  wins: number;
  time: number;
  [key: string]: unknown;
}

export const winnerResponseTemplate: IWinnerResponse = {
  id: 0,
  wins: 0,
  time: 0,
};

export interface ICarOptions {
  color: string;
  name: string;
  id?: number;
}

export interface IWinnersInfoResponse extends IWinnerResponse {
  color: string;
  name: string;
}
