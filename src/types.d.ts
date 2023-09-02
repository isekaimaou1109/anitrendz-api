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
    limitAndSort(limitRank: number, sortType: string);
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
  getCurrentTopAnimes(limitRank: number, sortType: string): Promise<Array<any>>;
  getCurrentTopMales(limitRank: number, sortType: string): Promise<Array<any>>;
  getCurrentTopFemales(limitRank: number, sortType: string): Promise<Array<any>>;
  getCurrentTopCouples(limitRank: number, sortType: string): Promise<Array<any>>;
  getCurrentTopOpeningSongs(limitRank: number, sortType: string): Promise<Array<any>>;
  getCurrentTopEndingSongs(limitRank: number, sortType: string): Promise<Array<any>>;
  getSpecifiedTopAnimesBasedOnSeason(
    year: number, season: number, 
    week: number, limitRank: number, 
    sortType: string
  ): Promise<Array<any>>;
}

// export type IAnimeTopOrAnimeSongTopTemplate = IAnimeTemplate | IAnimeSongTemplate; 

