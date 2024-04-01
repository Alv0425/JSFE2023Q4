import Component from "../component";

export interface ILevelData {
  id: string;
  name: string;
  imageSrc: string;
  cutSrc: string;
  author: string;
  year: string;
}

export interface IWord {
  audioExample: string;
  textExample: string;
  textExampleTranslate: string;
  id: number;
  word: string;
  wordTranslate: string;
}

export interface IRound {
  levelData: ILevelData;
  words: IWord[];
}

export interface ILevel {
  rounds: IRound[];
  roundsCount: number;
}

export interface IRoundResult {
  knownWords: number[];
  unknownWords: number[];
}

export type IStats = Record<string, IRoundResult>;

export interface IHintsOptions {
  imageHint: boolean;
  translationHint: boolean;
  audioHint: boolean;
}

export interface IRoundLevelInfo {
  level: number;
  round: number;
}

export interface ICurrentRoundStats {
  roundInfo?: IRound;
  currentStats?: IRoundResult;
}

export interface IStorage {
  hintsOptions: IHintsOptions;

  firstName?: string;
  surname?: string;

  stats?: IStats;
  lastRound?: IRoundLevelInfo;
  currentRound?: IRoundLevelInfo;
  currentRoundStats?: ICurrentRoundStats;
}

export interface ISelectLevel {
  openMmodalSelectGame: (callback: (round: number, level: number) => void) => void;
}

export type ComponentType = HTMLElement | Component | null;
