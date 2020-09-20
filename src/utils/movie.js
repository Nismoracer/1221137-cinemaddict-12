import moment from "moment";

export const humanizeDuration = (duration) => {
  const hours = duration / 60;
  return Math.floor(hours) + `h ` + Math.floor(duration % 60) + `m`;
};

export const humanizeReleaseDate = (createDate) => {
  return moment(createDate).format(`D MMMM YYYY`);
};

export const humanizeCommentDate = (commentDate) => {
  return moment(commentDate).startOf(`minute`).fromNow();
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
  return b.filmInfo.release.date.getTime() - a.filmInfo.release.date.getTime();
};

export const sortByRating = (a, b) => {
  return b.filmInfo.totalRating - a.filmInfo.totalRating;
};

export const getCurrentDate = () => {
  const currentDate = new Date();
  return currentDate.setHours(23, 59, 59, 999);
};
