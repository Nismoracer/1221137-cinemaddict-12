import {FilterType} from "../const.js";

export const filter = {
  [FilterType.ALL]: (movies) => movies.slice(),
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist === true),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.userDetails.favorite === true),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched === true),
};
