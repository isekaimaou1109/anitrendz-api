"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// node_modules/tsup/assets/cjs_shims.js
var getImportMetaUrl = () => typeof document === "undefined" ? new URL("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("main.js", document.baseURI).href;
var importMetaUrl = /* @__PURE__ */ getImportMetaUrl();

// src/index.ts
var import_axios = __toESM(require("axios"));
var fs = __toESM(require("fs"));
var import_path = require("path");
var import_url = require("url");
var import_app = require("firebase/app");
var import_lite = require("firebase/firestore/lite");
var AnimeTrendingApi = class {
  /** CORE MAINTER */
  #ANIMETRENDINGZ_INFO;
  #CORE_DB;
  /** URLS */
  #CURRENT_TOP_ANIME_URL = "https://us-central1-anitrendz-prod.cloudfunctions.net/animeTrendingAPI/charts/top-anime";
  #CURRENT_TOP_MALE_ANIME_URL = "https://us-central1-anitrendz-prod.cloudfunctions.net/animeTrendingAPI/charts/male-characters";
  #CURRENT_TOP_FEMALE_ANIME_URL = "https://us-central1-anitrendz-prod.cloudfunctions.net/animeTrendingAPI/charts/female-characters";
  #CURRENT_TOP_COUPLE_ANIME_URL = "https://us-central1-anitrendz-prod.cloudfunctions.net/animeTrendingAPI/charts/couple-ship";
  #CURRENT_TOP_OPENING_SONG_ANIME_URL = "https://us-central1-anitrendz-prod.cloudfunctions.net/animeTrendingAPI/charts/op-theme-songs";
  #CURRENT_TOP_ENDING_SONG_ANIME_URL = "https://us-central1-anitrendz-prod.cloudfunctions.net/animeTrendingAPI/charts/ed-theme-songs";
  constructor() {
    var path = "";
    if (__dirname) {
      path = (0, import_path.resolve)(__dirname, "../../secret.json");
    } else {
      const __filename2 = (0, import_url.fileURLToPath)(importMetaUrl);
      const __dirname2 = (0, import_path.dirname)(__filename2);
      path = (0, import_path.resolve)(__dirname2, "../../secret.json");
    }
    this.#ANIMETRENDINGZ_INFO = JSON.parse(
      fs.readFileSync(
        path,
        { encoding: "utf8" }
      )
    );
    this.#CORE_DB = (0, import_lite.getFirestore)((0, import_app.initializeApp)(this.#ANIMETRENDINGZ_INFO));
    Object.defineProperty(Array.prototype, "limitAndSort", {
      enumerable: false,
      value: function(limitRank, sortType = "asc") {
        return this.slice(0, !limitRank ? void 0 : limitRank).sort(
          (previous, next) => sortType === "asc" ? previous.currentPosition - next.currentPosition : next.currentPosition - previous.currentPosition
        );
      }
    });
  }
  /**
   *  CREATE A TEMPLATE
   */
  #templateAnimeTopPattern(title = null, originalAnimePattern, week = null, season = null, isSourceForSong = false) {
    title = title.toLowerCase();
    const {
      weeksAtTopTen,
      previously,
      position,
      name
    } = originalAnimePattern;
    const baseCustomization = {
      currentPosition: position,
      previousPosition: previously
    };
    const sampleDataNotForSong = {
      name: title === "couple ship" ? originalAnimePattern?.subText : name,
      totalVote: originalAnimePattern?.total,
      timesInTopTenOfASeason: weeksAtTopTen,
      season,
      week: +week,
      ...title === "couple ship" ? { coupleName: name } : {},
      ...originalAnimePattern?.namealt ? { alternativeName: originalAnimePattern.namealt } : {},
      ...originalAnimePattern?.images ? { images: originalAnimePattern.images } : {},
      ...title === "couple ship" ? {} : {
        studio: originalAnimePattern?.subText ? originalAnimePattern.subText : originalAnimePattern?.subtext
      },
      ...baseCustomization
    };
    const sampleDataForSong = {
      songName: name,
      singer: originalAnimePattern?.subtext,
      week: +originalAnimePattern?.oldChartData?.entry_chart_week.replace(/\bWeek\b/gm, "").trim(),
      season: originalAnimePattern?.oldChartData?.entry_chart_group.split(" ")[0].toLowerCase(),
      year: +originalAnimePattern?.oldChartData?.entry_chart_group.split(" ")[1],
      weeksAtTopTen,
      ...originalAnimePattern?.image ? { image: originalAnimePattern.image } : null,
      ...baseCustomization
    };
    return Object.fromEntries(
      Object.entries(
        !isSourceForSong ? sampleDataNotForSong : sampleDataForSong
      ).filter((currentAnime) => currentAnime[1] !== null || currentAnime[1] !== void 0)
    );
  }
  /**
   * FETCH DATA
   * 
   * @param {string} url - Link to get data
   * @returns {Promise<Array<any>>} Return array of items.
   */
  async #createRawDataSource(url) {
    return await (await import_axios.default.get(url)).data[0];
  }
  /**
   * MAP 1:1 FROM ORIGINAL DATA TO OTHER DATA
   * 
   * @param {number} limitRank - The year that you want to search.
   * @param {string} sortType - The sorting type can be 'asc' or 'dsc'.
   * @returns {Promise<any[]>} Return array of anime.
   */
  async #mapDataSource(originalData, isSourceForSong = false) {
    return await originalData.choices.map(
      (currentData) => this.#templateAnimeTopPattern(
        originalData.name,
        currentData,
        originalData.week,
        originalData.season,
        isSourceForSong
      )
    );
  }
  /**
   * API: GET CURRENT TOP ANIMES IN ANIME TRENDINGZ
   * 
   * @param {number} limitRank - The year that you want to search.
   * @param {string} sortType - The sorting type can be 'asc' or 'dsc'.
   * @returns {Promise<Array<IAnimeTemplate>>} Return array of current top anime.
   */
  async getCurrentTopAnimes(limitRank, sortType = "asc") {
    const listCurrentTopAnimes = await this.#mapDataSource(
      await this.#createRawDataSource(this.#CURRENT_TOP_ANIME_URL)
    );
    return listCurrentTopAnimes.limitAndSort(limitRank, sortType);
  }
  /**
   * API: GET CURRENT TOP MALES IN ANIME TRENDINGZ
   * 
   * @param {number} limitRank - The year that you want to search.
   * @param {string} sortType - The sorting type can be 'asc' or 'dsc'.
   * @returns {Promise<Array<IAnimeTemplate>>} Return array of current top male in anime.
   */
  async getCurrentTopMales(limitRank, sortType = "asc") {
    const listCurrentTopMales = await this.#mapDataSource(
      await this.#createRawDataSource(this.#CURRENT_TOP_MALE_ANIME_URL)
    );
    return listCurrentTopMales.limitAndSort(limitRank, sortType);
  }
  /**
   * API: GET CURRENT TOP FEMALES IN ANIME TRENDINGZ
   * 
   * @param {number} limitRank - The year that you want to search.
   * @param {string} sortType - The sorting type can be 'asc' or 'dsc'.
   * @returns {Promise<Array<IAnimeTemplate>>} Return array of current top female in anime.
   */
  async getCurrentTopFemales(limitRank, sortType = "asc") {
    const listCurrentTopFemales = await this.#mapDataSource(
      await this.#createRawDataSource(this.#CURRENT_TOP_FEMALE_ANIME_URL)
    );
    return listCurrentTopFemales.limitAndSort(limitRank, sortType);
  }
  /**
   * API: GET CURRENT TOP COUPLES IN ANIME TRENDINGZ
   * 
   * @param {number} limitRank - The year that you want to search.
   * @param {string} sortType - The sorting type can be 'asc' or 'dsc'.
   * @returns {Promise<Array<IAnimeTemplate>>} Return array of current top best couple in anime.
   */
  async getCurrentTopCouples(limitRank, sortType = "asc") {
    const listCurrentTopCouples = await this.#mapDataSource(
      await this.#createRawDataSource(this.#CURRENT_TOP_COUPLE_ANIME_URL)
    );
    return listCurrentTopCouples.limitAndSort(limitRank, sortType);
  }
  /**
   * API: GET CURRENT TOP OPENING SONGS IN ANIME TRENDINGZ
   * 
   * @param {number} limitRank - The year that you want to search.
   * @param {string} sortType - The sorting type can be 'asc' or 'dsc'.
   * @returns {Promise<Array<IAnimeSongTemplate>>} Return array of current top opening song in current season's anime.
   */
  async getCurrentTopOpeningSongs(limitRank, sortType = "asc") {
    const listCurrentTopOpeningSongs = await this.#mapDataSource(
      await this.#createRawDataSource(this.#CURRENT_TOP_OPENING_SONG_ANIME_URL),
      true
    );
    return listCurrentTopOpeningSongs.limitAndSort(limitRank, sortType);
  }
  /**
   * API: GET CURRENT TOP ENDING SONGS IN ANIME TRENDINGZ
   * 
   * @param {number} limitRank - The year that you want to search.
   * @param {string} sortType - The sorting type can be 'asc' or 'dsc'.
   * @returns {Promise<Array<IAnimeSongTemplate>>} Return array of current top ending song in current season's anime.
   */
  async getCurrentTopEndingSongs(limitRank, sortType = "asc") {
    const listCurrentTopEndingSongs = await this.#mapDataSource(
      await this.#createRawDataSource(this.#CURRENT_TOP_ENDING_SONG_ANIME_URL),
      true
    );
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
  async getSpecifiedTopAnimesBasedOnSeason(year, season, week, limitRank, sortType = "asc") {
    const listAllSeasonOfYear = await (0, import_lite.getDocs)((0, import_lite.collection)(this.#CORE_DB, `charts/top-anime/${year}`));
    const listSpecifiedSeason = listAllSeasonOfYear.docs.map((doc) => doc.data()).filter((currentAnime) => {
      return currentAnime.season === season && currentAnime.week === week;
    })[0];
    const allTopAnimesOfSpecifiedSeason = await this.#mapDataSource(
      listSpecifiedSeason
    );
    return allTopAnimesOfSpecifiedSeason.limitAndSort(limitRank, sortType).map((currentData) => {
      for (let key in currentData) {
        if (currentData[key] === null || currentData[key] === void 0) {
          delete currentData[key];
        }
      }
      return currentData;
    });
  }
};
var src_default = new AnimeTrendingApi();
