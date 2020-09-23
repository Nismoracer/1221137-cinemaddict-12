import moment from "moment";
import {UserStatus, UserStatistic} from "../const.js";

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
  if (numberWatched > UserStatistic.NOVICE_FROM && numberWatched <= UserStatistic.NOVICE_TO) {
    return UserStatus.NOVICE;
  } else if (numberWatched > UserStatistic.NOVICE_TO && numberWatched <= UserStatistic.FAN_TO) {
    return UserStatus.FAN;
  } else if (numberWatched > UserStatistic.EXPERT_FROM) {
    return UserStatus.MOVIE_BUFF;
  }
  return ``;
};

export const sortByDate = (a, b) => {
  return b.filmInfo.release.date.getTime() - a.filmInfo.release.date.getTime();
};

export const sortByRating = (a, b) => {
  return b.filmInfo.totalRating - a.filmInfo.totalRating;
};
