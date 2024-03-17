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

export interface IGame extends IRound {
  isSolved: boolean;
  numbersSolved: number[];
  numbersOpened: number[];
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

export interface IStorage {
  hintsOptions: {
    imageHint: boolean;
    translationHint: boolean;
    audioHint: boolean;
  };
  firstName?: string;
  surname?: string;

  stats?: IStats;
}
