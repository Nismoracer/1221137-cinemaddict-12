import {getRandomInteger, generateRandomArray, generateFilePath, generateName} from "../utils/common.js";
import {GENRES, POSTERS, TEST_STRINGS, NAMES, COUNTRIES, TITLES} from "../const.js";
import {generateComments} from "./comments.js";

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateTitle = () => {
  const randomIndex = getRandomInteger(0, TITLES.length - 1);
  return TITLES[randomIndex];
};

const generateRating = () => {
  const MAX_RATING = 10;
  return (getRandomInteger(1, MAX_RATING - 1) + Math.random()).toFixed(1);
};

const generateDate = () => {
  const maxDaysGap = 3650;
  const createDate = new Date();
  createDate.setHours(0, 0, 0, 0);
  const daysGap = getRandomInteger(0, maxDaysGap);
  createDate.setDate(createDate.getDate() - daysGap);
  return new Date(createDate);
};

const getUserInfo = () => {
  const alreadyWatched = Boolean(getRandomInteger(0, 1));
  const watchingDate = (alreadyWatched) ? generateDate() : null;
  return {
    watchlist: Boolean(getRandomInteger(0, 1)),
    favorite: Boolean(getRandomInteger(0, 1)),
    alreadyWatched,
    watchingDate
  };
};

export const generateMovie = () => {
  const postersPath = `./images/posters/`;
  const MAX_STRINGS = 3;
  const minDuration = 100;
  const maxDuration = 200;
  const minAge = 3;
  const maxAge = 18;
  const createDate = generateDate();
  const duration = getRandomInteger(minDuration, maxDuration);
  const title = generateTitle();

  return {
    id: generateId(),
    poster: generateFilePath(postersPath, POSTERS),
    title,
    rating: generateRating(),
    createDate,
    duration,
    genres: Array.from(new Set(generateRandomArray(GENRES, MAX_STRINGS))),
    description: generateRandomArray(TEST_STRINGS, MAX_STRINGS).join(` `),
    comments: generateComments(),
    altTitle: title,
    director: generateName(),
    writers: Array.from(new Set(generateRandomArray(NAMES, MAX_STRINGS))).join(`, `),
    actors: Array.from(new Set(generateRandomArray(NAMES, MAX_STRINGS))).join(`, `),
    country: Array.from(new Set(generateRandomArray(COUNTRIES, MAX_STRINGS))).join(`, `),
    restriction: getRandomInteger(minAge, maxAge),
    userDetails: getUserInfo()
  };
};
