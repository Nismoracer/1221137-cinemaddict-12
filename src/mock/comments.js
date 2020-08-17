import {TEST_STRINGS, EMOJES} from "../const.js";
import {getRandomInteger, generateFilePath, generateRandomArray, generateName} from "../util.js";

const generateDate = () => {
  const maxDaysGap = 3;
  const createDate = new Date();
  createDate.setHours();
  const daysGap = getRandomInteger(0, maxDaysGap);
  createDate.setDate(createDate.getDate() - daysGap);
  return new Date(createDate);
};

export const generateComments = () => {
  const MAX_COMMENTS = 5;
  const MAX_STRINGS = 3;
  const filePath = `./images/emoji/`;
  const sumComments = [];
  for (let i = 0; i < getRandomInteger(0, MAX_COMMENTS); i++) {
    const comment = {
      emoji: generateFilePath(filePath, EMOJES),
      name: generateName(),
      text: generateRandomArray(TEST_STRINGS, MAX_STRINGS).join(` `),
      date: generateDate(),
    };
    sumComments.push(comment);
  }
  return sumComments;
};
