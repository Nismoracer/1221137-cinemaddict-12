import {TEST_STRINGS, EMOJES} from "../const.js";
import {getRandomInteger, generateRandomArray, generateName} from "../utils/common.js";

const generateDate = () => {
  const maxDaysGap = 40;
  const createDate = new Date();
  const daysGap = getRandomInteger(0, maxDaysGap);
  createDate.setDate(createDate.getDate() - daysGap);
  return new Date(createDate);
};


const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const generateComments = () => {
  const comments = [];
  const MAX_STRINGS = 3;
  for (let i = 0; i < 5; i++) {
    let randomEmojiIndex = getRandomInteger(0, EMOJES.length - 1);
    const comment = {
      id: `$` + generateId() + `$`,
      emotion: EMOJES[randomEmojiIndex],
      author: generateName(),
      comment: generateRandomArray(TEST_STRINGS, MAX_STRINGS).join(` `),
      date: generateDate(),
    };
    comments.push(comment);
  }
  return comments;
};
