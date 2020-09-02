import moment from "moment";

export const humanizeDuration = (duration) => {
  const hours = duration / 60;
  return Math.floor(hours) + `h ` + Math.floor(duration % 60) + `m`;
};

export const humanizeReleaseDate = (createDate) => {
  return moment(createDate).format(`D MMMM YYYY`);
};

export const humanizeCommentDate = (commentDate) => {
  return moment(commentDate).startOf(`hour`).fromNow();
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
  return b.createDate.getTime() - a.createDate.getTime();
};

export const sortByRating = (a, b) => {
  return parseInt((b.rating.replace(`.`, ``)), 10) - parseInt((a.rating.replace(`.`, ``)), 10);
};
