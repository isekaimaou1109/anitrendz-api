export type Season = "fall" | "spring" | "winter" | "summer";
export type SortType = "asc" | "dsc";

export interface StoreConfig {
  readonly appId: string;
  readonly authDomain: string;
  readonly locationId: string;
  readonly measurementId: string;
  readonly messagingSenderId: string;
  readonly projectId: string;
  readonly storageBucket: string;
}

export interface IPositionTemplate {
  readonly currentPosition: number;
  readonly previousPosition: number;
}

interface Image<T> {
  small: T;
  large: T;
  medium: T;
  full: T;
}

declare global {
  interface Array<T> {
    limitAndSort(limitRank?: number, sortType?: SortType);
  }
}

export type IAnimeTemplate = {
  readonly name: string;
  readonly timesInTopTenOfASeason: number;
  readonly week: number;
  readonly season: string | number;
  readonly coupleName?: string;
  readonly alternativeName?: string,
  readonly studio?: string;
  readonly images?: Image<string>;
  readonly totalVote?: number;
} & IPositionTemplate;

export type IAnimeSongTemplate = {
  readonly songName: string;
  readonly week: number;
  readonly season: string;
  readonly year: number;
  readonly weeksAtTopTen: number;
  readonly singer?: string;
  readonly image?: Image<string>;
} & IPositionTemplate;

export interface IAnimeTrendingApiTemplate {
  getCurrentTopAnimes(limitRank?: number, sortType?: SortType): Promise<Array<any>>;
  getCurrentTopMales(limitRank?: number, sortType?: SortType): Promise<Array<any>>;
  getCurrentTopFemales(limitRank?: number, sortType?: SortType): Promise<Array<any>>;
  getCurrentTopCouples(limitRank?: number, sortType?: SortType): Promise<Array<any>>;
  getCurrentTopOpeningSongs(limitRank?: number, sortType?: SortType): Promise<Array<any>>;
  getCurrentTopEndingSongs(limitRank?: number, sortType?: SortType): Promise<Array<any>>;
  getSpecifiedTopAnimesBasedOnSeason(
    year: Required<number>, season: Required<Season>, 
    week: Required<number>, limitRank?: number, 
    sortType?: SortType
  ): Promise<Array<any>>;
}

// export type IAnimeTopOrAnimeSongTopTemplate = IAnimeTemplate | IAnimeSongTemplate; 

