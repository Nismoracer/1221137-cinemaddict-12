import moment from "moment";

export const humanizeDuration = (duration) => {
  const minutes = 60;
  const hours = duration / minutes;
  return Math.floor(hours) + `h ` + Math.floor(duration % minutes) + `m`;
};

export const humanizeReleaseDate = (createDate) => {
  return moment(createDate).format(`D MMMM YYYY`);
};

export const humanizeCommentDate = (commentDate) => {
  return moment(commentDate).startOf(`minute`).fromNow();
};

export const getUserStatus = (numberWatched) => {
  const noviceFrom = 0;
  const noviceTo = 10;
  const fanTo = 20;
  const expertFrom = 21;
  if (numberWatched > noviceFrom && numberWatched <= noviceTo) {
    return `novice`;
  } else if (numberWatched > noviceTo && numberWatched <= fanTo) {
    return `fan`;
  } else if (numberWatched > expertFrom) {
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
