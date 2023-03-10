"use strict"

const fs = require('fs');
const { resolve } = require('path');
const axios = require('axios').default;
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore/lite');

class AnimeTrendingApi {
  /** CORE MAINTER */
  #ANIMETRENDINGZ_INFO; #CORE_DB;

  /** URLS TO GET CURRENT TOP */
  #CURRENT_TOP_ANIME_URL = 'https://us-central1-anitrendz-prod.cloudfunctions.net/animeTrendingAPI/charts/top-anime';
  #CURRENT_TOP_MALE_ANIME_URL = 'https://us-central1-anitrendz-prod.cloudfunctions.net/animeTrendingAPI/charts/male-characters';
  #CURRENT_TOP_FEMALE_ANIME_URL = 'https://us-central1-anitrendz-prod.cloudfunctions.net/animeTrendingAPI/charts/female-characters';
  #CURRENT_TOP_COUPLE_ANIME_URL = 'https://us-central1-anitrendz-prod.cloudfunctions.net/animeTrendingAPI/charts/couple-ship';
  #CURRENT_TOP_OPENING_SONG_ANIME_URL = 'https://us-central1-anitrendz-prod.cloudfunctions.net/animeTrendingAPI/charts/op-theme-songs';
  #CURRENT_TOP_ENDING_SONG_ANIME_URL = 'https://us-central1-anitrendz-prod.cloudfunctions.net/animeTrendingAPI/charts/ed-theme-songs';

  constructor() {
    this.#ANIMETRENDINGZ_INFO = JSON.parse(
      fs.readFileSync(
        resolve(__dirname, '../secret.json'),
        { encoding: 'utf8' }
      )
    )
    this.#CORE_DB = getFirestore(initializeApp(this.#ANIMETRENDINGZ_INFO));
  }

  /**
   *  THIS FUNCTION WILL CREATE A TEMPLATE
   *  FOR EACH TOP ANIME
   */
  #templateAnimeTopPattern(
    title = null, originalAnimePattern, 
    week = null, season = null, isSourceForSong = false
  ) {
    title = title.toLowerCase();
    const { 
      weeksAtTopTen, previously, position,
      name
    } = originalAnimePattern;

    const baseCustomization = {
      currentPosition: position,
      previousPosition: previously
    }

    const sampleDataNotForSong = {
      coupleName: title === 'couple ship' ? name : null,
      name: title === 'couple ship' ? originalAnimePattern?.subText : name,
      alternativeName: originalAnimePattern?.namealt ? originalAnimePattern?.namealt : null,
      studio: title === 'couple ship' ? null : (originalAnimePattern?.subText ? originalAnimePattern?.subText : originalAnimePattern?.subtext),
      totalVote: originalAnimePattern?.total,
      timesInTopTenOfASeason: weeksAtTopTen,
      images: originalAnimePattern?.images ? originalAnimePattern?.images : null,
      week: +week, 
      season,
      ...baseCustomization,
    }

    const sampleDataForSong = {
      songName: name,
      singer: originalAnimePattern?.subtext,
      image: originalAnimePattern?.image ? originalAnimePattern?.image : null,
      week: +originalAnimePattern?.oldChartData?.entry_chart_week.replace(/\bWeek\b/gm, '').trim(),
      season: originalAnimePattern?.oldChartData?.entry_chart_group.split(" ")[0].toLowerCase(),
      year: +originalAnimePattern?.oldChartData?.entry_chart_group.split(" ")[1],
      weeksAtTopTen,
      ...baseCustomization,
    };

    return Object.fromEntries(
      Object.entries(
        !isSourceForSong ? 
          sampleDataNotForSong : 
          sampleDataForSong
      ).filter(currentAnime => currentAnime[1] !== null || currentAnime[1] !== undefined)
    )
  }

  /**
   *  THIS FUNCTION WILL FETCH DATA AND IT IS SOURCE 
   *  DATA
   */
  async #createRawDataSource(url) {
    return await (await axios.get(url)).data[0]
  }


  /** 
   *  THIS FUNCTION WILL LIMIT RANK YOU WANT TO GET
   *  AND SORT ASCENDING OR DESCENDING BASED-ON YOU 
   *  WANT 
   */
  #limitAndSort(dataSource, limitRank = null, sortType = 'asc') {
    return dataSource
      .slice(0, !limitRank ? undefined : limitRank)
      .sort((previous, next) => 
        sortType === 'asc' ? 
          next.currentPosition - previous.currentPosition : 
          previous.currentPosition - next.currentPosition
      );
  }

  /**
   *  THIS FUNCTION WILL MAP 1:1 FROM ORIGINAL DATA
   *  TO OTHER DATA
   */
  async #mapDataSource(originalData, isSourceForSong = false) {
    return await originalData.choices.map((currentData) => 
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
   * @returns {Promise<any[]>} Return array of anime.
   */
  async getCurrentTopAnimes(limitRank = null, sortType = 'asc') {
    const listCurrentTopAnimes = await this.#mapDataSource(
      await this.#createRawDataSource(this.#CURRENT_TOP_ANIME_URL)
    )
    
    return this.#limitAndSort(listCurrentTopAnimes, limitRank, sortType);
  }


  /**
   * API: GET CURRENT TOP MALES IN ANIME TRENDINGZ
   * 
   * @param {number} limitRank - The year that you want to search.
   * @param {string} sortType - The sorting type can be 'asc' or 'dsc'.
   * @returns {Promise<any[]>} Return array of anime.
   */
  async getCurrentTopMales(limitRank = null, sortType = 'asc') {
    const listCurrentTopMales = await this.#mapDataSource(
      await this.#createRawDataSource(this.#CURRENT_TOP_MALE_ANIME_URL)
    )
    return this.#limitAndSort(listCurrentTopMales, limitRank, sortType);
  }


  /**
   * API: GET CURRENT TOP FEMALES IN ANIME TRENDINGZ
   * 
   * @param {number} limitRank - The year that you want to search.
   * @param {string} sortType - The sorting type can be 'asc' or 'dsc'.
   * @returns {Promise<any[]>} Return array of anime.
   */
  async getCurrentTopFemales(limitRank = null, sortType = 'asc') {
    const listCurrentTopFemales = await this.#mapDataSource(
      await this.#createRawDataSource(this.#CURRENT_TOP_FEMALE_ANIME_URL)
    )
    return this.#limitAndSort(listCurrentTopFemales, limitRank, sortType);
  }
  

  /**
   * API: GET CURRENT TOP COUPLES IN ANIME TRENDINGZ
   * 
   * @param {number} limitRank - The year that you want to search.
   * @param {string} sortType - The sorting type can be 'asc' or 'dsc'.
   * @returns {Promise<any[]>} Return array of anime.
   */
  async getCurrentTopCouples(limitRank = null, sortType = 'asc') {
    const listCurrentTopCouples = await this.#mapDataSource(
      await this.#createRawDataSource(this.#CURRENT_TOP_COUPLE_ANIME_URL)
    )
    return this.#limitAndSort(listCurrentTopCouples, limitRank, sortType);
  }


  /**
   * API: GET CURRENT TOP OPENING SONGS IN ANIME TRENDINGZ
   * 
   * @param {number} limitRank - The year that you want to search.
   * @param {string} sortType - The sorting type can be 'asc' or 'dsc'.
   * @returns {Promise<any[]>} Return array of anime.
   */
  async getCurrentTopOpeningSongs(limitRank = null, sortType = 'asc') {
    const listCurrentTopOpeningSongs = await this.#mapDataSource(
      await this.#createRawDataSource(this.#CURRENT_TOP_OPENING_SONG_ANIME_URL),
      true
    )
    return this.#limitAndSort(listCurrentTopOpeningSongs, limitRank, sortType);
  }


  /**
   * API: GET CURRENT TOP ENDING SONGS IN ANIME TRENDINGZ
   * 
   * @param {number} limitRank - The year that you want to search.
   * @param {string} sortType - The sorting type can be 'asc' or 'dsc'.
   * @returns {Promise<any[]>} Return array of anime.
   */
  async getCurrentTopEndingSongs(limitRank = null, sortType = 'asc') {
    const listCurrentTopEndingSongs = await this.#mapDataSource(
      await this.#createRawDataSource(this.#CURRENT_TOP_ENDING_SONG_ANIME_URL),
      true
    )
    return this.#limitAndSort(listCurrentTopEndingSongs, limitRank, sortType);
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
  async getSpecifiedTopAnimesBasedOnSeason(year, season, week, limitRank = null, sortType = 'asc') {
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
    const allTopAnimesOfSpecifiedSeason = await this.#mapDataSource(
      listSpecifiedSeason
    )
    return this.#limitAndSort(allTopAnimesOfSpecifiedSeason, limitRank, sortType).map((currentData) => {
      for (let key in currentData) {
        if (currentData[key] === null || currentData[key] === undefined) {
          delete currentData[key];
        }
      }
      return currentData;
    })
  }
}

module.exports = new AnimeTrendingApi()


