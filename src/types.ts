export interface IPositionTemplate {
  readonly currentPosition: number;
  readonly previousPosition: number;
}

export type IAnimeTemplate = {
  readonly name: string;
  readonly timesInTopTenOfASeason: number;
  readonly week: number;
  readonly season: number;
  readonly coupleName?: string;
  readonly alternativeName?: string,
  readonly studio?: string;
  readonly images?: Array<string>;
  readonly totalVote?: number;
} & IPositionTemplate;

export type IAnimeSongTemplate = {
  readonly songName: string;
  readonly week: number;
  readonly season: string;
  readonly year: number;
  readonly weeksAtTopTen: number;
  readonly singer?: string;
  readonly image?: any;
} & IPositionTemplate;



