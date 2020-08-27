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

export const getUserStatus = (numberWatched) => {
  if (numberWatched > 0 && numberWatched <= 10) {
    return `novice`;
  } else if (numberWatched > 10 && numberWatched <= 20) {
    return `fan`;
  } else if (numberWatched > 21) {
    return `movie buff`;
  }
  return ``;
};

export const sortByDate = (a, b) => {
  return a.createDate.getTime() - b.createDate.getTime();
};

export const sortByRating = (a, b) => {
  return parseInt((a.rating.replace(`.`, ``)), 10) - parseInt((b.rating.replace(`.`, ``)), 10);
};
