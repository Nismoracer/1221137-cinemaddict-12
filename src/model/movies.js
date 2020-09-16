import Observer from "../utils/observer.js";

export default class Movies extends Observer {
  constructor() {
    super();
    this._movies = [];
  }

  setMovies(updateType, movies) {
    this._movies = movies.slice();
    this._notify(updateType);
  }

  getMovies() {
    return this._movies;
  }

  updateMovie(updateType, update) {
    const index = this._movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting movie`);
    }
    this._movies[index] = update;
    this._notify(updateType, update);
  }

  static adaptToClient(movie) {
    const adaptedRelease = Object.assign(
        {}, movie.film_info.release, {
          releaseCountry: movie.film_info.release.release_country,
          date: movie.film_info.release.date !== null ? new Date(movie.film_info.release.date) : movie.film_info.release.date
        });
    delete adaptedRelease.release_country;

    const adaptedFilmInfo = Object.assign(
        {}, movie.film_info, {
          ageRating: movie.film_info.age_rating,
          alternativeTitle: movie.film_info.alternative_title,
          runTime: movie.film_info.runtime,
          totalRating: movie.film_info.total_rating.toString(),
          release: adaptedRelease,
        });
    delete adaptedFilmInfo.age_rating;
    delete adaptedFilmInfo.alternative_title;
    delete adaptedFilmInfo.runtime;
    delete adaptedFilmInfo.total_rating;

    const adaptedUserDetails = Object.assign(
        {}, movie.user_details, {
          alreadyWatched: movie.user_details.already_watched,
          watchingDate: movie.user_details.watching_date !== null ? new Date(movie.user_details.watching_date) : movie.user_details.watching_date
        });
    delete adaptedUserDetails.already_watched;
    delete adaptedUserDetails.watching_date;

    const adaptedMovie = Object.assign(
        {},
        movie,
        {
          filmInfo: adaptedFilmInfo,
          userDetails: adaptedUserDetails
        }
    );

    delete adaptedMovie.film_info;
    delete adaptedMovie.user_details;

    return adaptedMovie;
  }

  static adaptToServer(movie) {
    const adaptedRelease = Object.assign(
        {}, movie.filmInfo.release, {
          release_country: movie.filmInfo.release.releaseCountry,
          date: movie.filmInfo.release.date instanceof Date ? movie.filmInfo.release.date.toISOString() : null
        });
    delete adaptedRelease.releaseCountry;

    const adaptedFilmInfo = Object.assign(
        {}, movie.filmInfo, {
          age_rating: movie.filmInfo.ageRating,
          alternative_title: movie.filmInfo.alternativeTitle,
          runtime: movie.filmInfo.runTime,
          total_rating: parseInt(movie.filmInfo.totalRating, 10),
          release: adaptedRelease,
        });
    delete adaptedFilmInfo.ageRating;
    delete adaptedFilmInfo.alternativeTitle;
    delete adaptedFilmInfo.runTime;
    delete adaptedFilmInfo.totalRating;

    const adaptedUserDetails = Object.assign(
        {}, movie.userDetails, {
          already_watched: movie.userDetails.alreadyWatched,
          watching_date: movie.userDetails.watchingDate instanceof Date ? movie.userDetails.watchingDate.toISOString() : null
        });
    delete adaptedUserDetails.alreadyWatched;
    delete adaptedUserDetails.watchingDate;

    const adaptedMovie = Object.assign(
        {},
        movie,
        {
          comments: movie.comments,
          film_info: adaptedFilmInfo,
          user_details: adaptedUserDetails
        }
    );

    delete adaptedMovie.filmInfo;
    delete adaptedMovie.userDetails;
    return adaptedMovie;
  }
}
