const movieToFilterMap = {
  watchlist: (movies) => movies.filter((movie) => movie.isWatchlist).length,
  favorite: (movies) => movies.filter((movie) => movie.isFavorite).length,
  history: (movies) => movies.filter((movie) => movie.isHistory).length,
};

export const generateFilter = (movies) => {
  return Object.entries(movieToFilterMap).map(([filterName, countMovies]) => {
    return {
      name: filterName,
      count: countMovies(movies),
    };
  });
};
