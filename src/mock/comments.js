import {TEST_STRINGS, EMOJES} from "../const.js";
import {getRandomInteger, generateRandomArray, generateName} from "../utils/common.js";

const generateDate = () => {
  const maxDaysGap = 40;
  const createDate = new Date();
  const daysGap = getRandomInteger(0, maxDaysGap);
  createDate.setDate(createDate.getDate() - daysGap);
  return new Date(createDate);
};

export const generateComments = () => {
  const MAX_COMMENTS = 5;
  const MAX_STRINGS = 3;
  const sumComments = [];
  for (let i = 0; i < getRandomInteger(0, MAX_COMMENTS); i++) {
    let randomEmojiIndex = getRandomInteger(0, EMOJES.length - 1);
    const comment = {
      emotion: EMOJES[randomEmojiIndex],
      author: generateName(),
      comment: generateRandomArray(TEST_STRINGS, MAX_STRINGS).join(` `),
      date: generateDate(),
    };
    sumComments.push(comment);
  }
  return sumComments;
};
