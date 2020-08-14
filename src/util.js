import {NAMES} from "./const.js";

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const generateRandomArray = (initialStrings = [], maxElements = 0) => {
  const movies = new Array(getRandomInteger(1, maxElements))
    .fill().map(function () {
      const randomIndex = getRandomInteger(0, initialStrings.length - 1);
      return initialStrings[randomIndex];
    });
  return movies;
};

export const generateFilePath = (filePath = [], inputStrings) => {
  const randomIndex = getRandomInteger(0, inputStrings.length - 1);
  return filePath + inputStrings[randomIndex];
};

export const humanizeDuration = (duration) => {
  const hours = duration / 60;
  return Math.floor(hours) + `h ` + Math.floor(duration % 60) + `m`;
};

export const humanizeReleaseDate = (createDate) => {
  const releaseDate = createDate.toLocaleString(`en-US`, {day: `numeric`, month: `long`, year: `numeric`}).replace(/,/g, ``);
  const temporaryStrings = releaseDate.split(` `);
  [temporaryStrings[0], temporaryStrings [1]] = [temporaryStrings[1], temporaryStrings [0]];
  return temporaryStrings.join(` `);
};

export const generateName = () => {
  const randomIndex = getRandomInteger(0, NAMES.length - 1);
  return NAMES[randomIndex];
};

export const defineUserStatus = (numberWatched) => {
  if (numberWatched > 0 && numberWatched <= 10) {
    return `novice`;
  } else if (numberWatched > 10 && numberWatched <= 20) {
    return `fan`;
  } else if (numberWatched > 21) {
    return `movie buff`;
  }
  return ``;
};