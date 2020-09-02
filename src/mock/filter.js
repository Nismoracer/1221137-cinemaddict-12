const movieToFilterMap = {
  watchlist: (movies) => movies.filter((movie) => movie.userDetails.watchlist).length,
  favorite: (movies) => movies.filter((movie) => movie.userDetails.favorite).length,
  watched: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched).length,
};

export const generateFilter = (movies) => {
  return Object.entries(movieToFilterMap).map(([filterName, countMovies]) => {
    return {
      name: filterName,
      count: countMovies(movies),
    };
  });
};
