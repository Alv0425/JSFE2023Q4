export interface IWinnersInfo {
  id: number;
  wins: number;
  time: number;

  [key: string]: unknown;
}

export const winnersInfoTemplate: IWinnersInfo = {
  id: 1,
  wins: 1,
  time: 1,
};

export interface ICarResponse {
  name: string;
  color: string;
  id: number;
  [key: string]: unknown;
}

export const carResponseTemplate: ICarResponse = {
  name: "",
  color: "",
  id: 1,
};

export interface IDriveStatusResponse {
  success: boolean;

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

export const engineStatusResponseTemplate = {
  velocity: 64,
  distance: 500000,
};

export interface IWinnerResponse {
  id: number;
  wins: number;
  time: number;
  [key: string]: unknown;
}

export const winnerResponseTemplate: IWinnerResponse = {
  id: 1,
  wins: 1,
  time: 1,
};
