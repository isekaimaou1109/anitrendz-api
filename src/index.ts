"use strict"

import axios from "axios";
import * as fs from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from 'url';
import { initializeApp as init } from "firebase/app"
import { 
  getFirestore as store,
  collection,
  getDocs
} from "firebase/firestore/lite"

/** IMPORT TYPE HERE */
import type {
  Firestore
} from "firebase/firestore/lite"
import type { 
  IPositionTemplate, IAnimeTemplate, StoreConfig,
  IAnimeSongTemplate, IAnimeTrendingApiTemplate
} from "@/types"

class AnimeTrendingApi implements IAnimeTrendingApiTemplate {
  /** CORE MAINTER */
  readonly #ANIMETRENDINGZ_INFO!: StoreConfig; 
  readonly #CORE_DB!: Firestore;

  /** URLS */
  readonly #CURRENT_TOP_ANIME_URL: string = 'https://us-central1-anitrendz-prod.cloudfunctions.net/animeTrendingAPI/charts/top-anime';
  readonly #CURRENT_TOP_MALE_ANIME_URL: string = 'https://us-central1-anitrendz-prod.cloudfunctions.net/animeTrendingAPI/charts/male-characters';
  readonly #CURRENT_TOP_FEMALE_ANIME_URL: string = 'https://us-central1-anitrendz-prod.cloudfunctions.net/animeTrendingAPI/charts/female-characters';
  readonly #CURRENT_TOP_COUPLE_ANIME_URL: string = 'https://us-central1-anitrendz-prod.cloudfunctions.net/animeTrendingAPI/charts/couple-ship';
  readonly #CURRENT_TOP_OPENING_SONG_ANIME_URL: string = 'https://us-central1-anitrendz-prod.cloudfunctions.net/animeTrendingAPI/charts/op-theme-songs';
  readonly #CURRENT_TOP_ENDING_SONG_ANIME_URL: string = 'https://us-central1-anitrendz-prod.cloudfunctions.net/animeTrendingAPI/charts/ed-theme-songs';

  constructor() {
    var path: string = "";
    if (__dirname) {
      path = resolve(__dirname, '../../secret.json');
    } else {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      path = resolve(__dirname, '../../secret.json')
    }

    this.#ANIMETRENDINGZ_INFO = JSON.parse(
      fs.readFileSync(
        path, { encoding: 'utf8' }
      )
    )
    this.#CORE_DB = store(init(this.#ANIMETRENDINGZ_INFO));

    Object.defineProperty(Array.prototype, "limitAndSort", {
      enumerable: false,
      value: function(limitRank: number, sortType: string = 'asc') {
        return this
        .slice(0, !limitRank ? undefined : limitRank)
        .sort((previous, next) => 
          sortType === 'asc' ? 
            previous.currentPosition - next.currentPosition :
            next.currentPosition - previous.currentPosition
        );
      }
    })
  }

  /**
   *  CREATE A TEMPLATE
   */
  #templateAnimeTopPattern(
    title: string = null, originalAnimePattern: any, 
    week: number = null, season: number = null, 
    isSourceForSong: boolean = false
  ) {
    title = title.toLowerCase();
    const { 
      weeksAtTopTen, previously, position,
      name
    } = originalAnimePattern;

    const baseCustomization: IPositionTemplate = {
      currentPosition: position,
      previousPosition: previously
    }

    const sampleDataNotForSong: IAnimeTemplate = {
      name: title === 'couple ship' ? originalAnimePattern?.subText : name,
      totalVote: originalAnimePattern?.total,
      timesInTopTenOfASeason: weeksAtTopTen,
      season,
      week: +week, 
      ...(title === 'couple ship' ? { coupleName: name } : {}),
      ...(originalAnimePattern?.namealt ? { alternativeName: originalAnimePattern.namealt } : {}),
      ...(originalAnimePattern?.images ? { images: originalAnimePattern.images } : {}),
      ...(title === 'couple ship' ? {} : {
        studio: originalAnimePattern?.subText ? originalAnimePattern.subText : originalAnimePattern?.subtext
      }),
      ...baseCustomization,
    }

    const sampleDataForSong: IAnimeSongTemplate = {
      songName: name,
      singer: originalAnimePattern?.subtext,
      week: +originalAnimePattern?.oldChartData?.entry_chart_week.replace(/\bWeek\b/gm, '').trim(),
      season: originalAnimePattern?.oldChartData?.entry_chart_group.split(" ")[0].toLowerCase(),
      year: +originalAnimePattern?.oldChartData?.entry_chart_group.split(" ")[1],
      weeksAtTopTen,
      ...(originalAnimePattern?.image ? { image: originalAnimePattern.image } : null),
      ...baseCustomization,
    };

    return Object.fromEntries(
      Object.entries(
        !isSourceForSong ? 
          sampleDataNotForSong : 
          sampleDataForSong
      ).filter((currentAnime) => currentAnime[1] !== null || currentAnime[1] !== undefined)
    )
  }

  /**
   * FETCH DATA
   * 
   * @param {string} url - Link to get data
   * @returns {Promise<Array<any>>} Return array of items.
   */
  async #createRawDataSource(url: Required<string>): Promise<Array<any>> {
    return await (await axios.get(url)).data[0] 
  }

  /**
   * MAP 1:1 FROM ORIGINAL DATA TO OTHER DATA
   * 
   * @param {number} limitRank - The year that you want to search.
   * @param {string} sortType - The sorting type can be 'asc' or 'dsc'.
   * @returns {Promise<any[]>} Return array of anime.
   */
  async #mapDataSource(originalData, isSourceForSong: boolean = false): Promise<any> {
    return await originalData.choices.map(currentData =>
      this.#templateAnimeTopPattern(
        originalData.name,
        currentData, 
        originalData.week, 
        originalData.season,
        isSourceForSong,
      )
    )
  }


  /**
   * API: GET CURRENT TOP ANIMES IN ANIME TRENDINGZ
   * 
   * @param {number} limitRank - The year that you want to search.
   * @param {string} sortType - The sorting type can be 'asc' or 'dsc'.
   * @returns {Promise<Array<IAnimeTemplate>>} Return array of current top anime.
   */
  async getCurrentTopAnimes(limitRank: number, sortType: string = 'asc'): Promise<Array<IAnimeTemplate>> {
    const listCurrentTopAnimes: Array<IAnimeTemplate> = await this.#mapDataSource(
      await this.#createRawDataSource(this.#CURRENT_TOP_ANIME_URL)
    )
    
    return listCurrentTopAnimes.limitAndSort(limitRank, sortType);
  }


  /**
   * API: GET CURRENT TOP MALES IN ANIME TRENDINGZ
   * 
   * @param {number} limitRank - The year that you want to search.
   * @param {string} sortType - The sorting type can be 'asc' or 'dsc'.
   * @returns {Promise<Array<IAnimeTemplate>>} Return array of current top male in anime.
   */
  async getCurrentTopMales(limitRank: number, sortType: string = 'asc'): Promise<Array<IAnimeTemplate>> {
    const listCurrentTopMales: Array<IAnimeTemplate> = await this.#mapDataSource(
      await this.#createRawDataSource(this.#CURRENT_TOP_MALE_ANIME_URL)
    )
    return listCurrentTopMales.limitAndSort(limitRank, sortType);
  }


  /**
   * API: GET CURRENT TOP FEMALES IN ANIME TRENDINGZ
   * 
   * @param {number} limitRank - The year that you want to search.
   * @param {string} sortType - The sorting type can be 'asc' or 'dsc'.
   * @returns {Promise<Array<IAnimeTemplate>>} Return array of current top female in anime.
   */
  async getCurrentTopFemales(limitRank: number, sortType: string = 'asc'): Promise<Array<IAnimeTemplate>> {
    const listCurrentTopFemales: Array<IAnimeTemplate> = await this.#mapDataSource(
      await this.#createRawDataSource(this.#CURRENT_TOP_FEMALE_ANIME_URL)
    )
    return listCurrentTopFemales.limitAndSort(limitRank, sortType);
  }
  

  /**
   * API: GET CURRENT TOP COUPLES IN ANIME TRENDINGZ
   * 
   * @param {number} limitRank - The year that you want to search.
   * @param {string} sortType - The sorting type can be 'asc' or 'dsc'.
   * @returns {Promise<Array<IAnimeTemplate>>} Return array of current top best couple in anime.
   */
  async getCurrentTopCouples(limitRank: number, sortType: string = 'asc'): Promise<Array<IAnimeTemplate>> {
    const listCurrentTopCouples: Array<IAnimeTemplate> = await this.#mapDataSource(
      await this.#createRawDataSource(this.#CURRENT_TOP_COUPLE_ANIME_URL)
    )
    return listCurrentTopCouples.limitAndSort(limitRank, sortType);
  }


  /**
   * API: GET CURRENT TOP OPENING SONGS IN ANIME TRENDINGZ
   * 
   * @param {number} limitRank - The year that you want to search.
   * @param {string} sortType - The sorting type can be 'asc' or 'dsc'.
   * @returns {Promise<Array<IAnimeSongTemplate>>} Return array of current top opening song in current season's anime.
   */
  async getCurrentTopOpeningSongs(limitRank: number, sortType: string = 'asc'): Promise<Array<IAnimeSongTemplate>> {
    const listCurrentTopOpeningSongs: Array<IAnimeSongTemplate> = await this.#mapDataSource(
      await this.#createRawDataSource(this.#CURRENT_TOP_OPENING_SONG_ANIME_URL),
      true
    )
    return listCurrentTopOpeningSongs.limitAndSort(limitRank, sortType);
  }


  /**
   * API: GET CURRENT TOP ENDING SONGS IN ANIME TRENDINGZ
   * 
   * @param {number} limitRank - The year that you want to search.
   * @param {string} sortType - The sorting type can be 'asc' or 'dsc'.
   * @returns {Promise<Array<IAnimeSongTemplate>>} Return array of current top ending song in current season's anime.
   */
  async getCurrentTopEndingSongs(limitRank: number, sortType: string = 'asc'): Promise<Array<IAnimeSongTemplate>> {
    const listCurrentTopEndingSongs: Array<IAnimeSongTemplate> = await this.#mapDataSource(
      await this.#createRawDataSource(this.#CURRENT_TOP_ENDING_SONG_ANIME_URL),
      true
    )
    return listCurrentTopEndingSongs.limitAndSort(limitRank, sortType);
  }


  /**
   * API: GET SPECIFIED TOP ANIMES
   * 
   * @param {number} year - The year that you want to search.
   * @param {string} season - The season that you want to search (fall|spring|winter|sommer).
   * @param {number} week - The week that you want to search.
   * @param {number} limitRank - The year that you want to search.
   * @param {string} sortType - The sorting type can be 'asc' or 'dsc'.
   * @returns {Promise<any[]>} Return array of anime.
   */
  async getSpecifiedTopAnimesBasedOnSeason(
    year: number, season: number, 
    week: number, limitRank: number, 
    sortType: string = 'asc'
  ): Promise<Array<IAnimeTemplate>> {
    const listAllSeasonOfYear = await getDocs(collection(this.#CORE_DB, `charts/top-anime/${year}`));
    const listSpecifiedSeason = listAllSeasonOfYear
      .docs
      .map(doc => doc.data())
      .filter((currentAnime) => {
        return (
          currentAnime.season === season && 
          currentAnime.week === week
        )
      })[0]
    const allTopAnimesOfSpecifiedSeason: Array<IAnimeTemplate> = await this.#mapDataSource(
      listSpecifiedSeason
    )
    return allTopAnimesOfSpecifiedSeason.limitAndSort(limitRank, sortType).map((currentData) => {
      for (let key in currentData) {
        if (currentData[key] === null || currentData[key] === undefined) {
          delete currentData[key];
        }
      }
      return currentData;
    })
  }
}

export default new AnimeTrendingApi();


