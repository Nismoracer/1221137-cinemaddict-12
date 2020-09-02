import {NAMES} from "../const.js";

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const generateRandomArray = (initialStrings = [], maxElements = 0) => {
  const movies = new Array(getRandomInteger(1, maxElements))
    .fill().map(() => {
      const randomIndex = getRandomInteger(0, initialStrings.length - 1);
      return initialStrings[randomIndex];
    });
  return movies;
};

export const generateName = () => {
  const randomIndex = getRandomInteger(0, NAMES.length - 1);
  return NAMES[randomIndex];
};

export const generateFilePath = (filePath = [], inputStrings) => {
  const randomIndex = getRandomInteger(0, inputStrings.length - 1);
  return filePath + inputStrings[randomIndex];
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};
