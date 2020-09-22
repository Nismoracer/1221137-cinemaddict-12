import {humanizeDuration} from "../utils/movie.js";
import AbstractView from "./abstract.js";

const DESCRIPTION_LENGTH = 140;

const cropDescription = (inputText) => {
  if (inputText.length < DESCRIPTION_LENGTH) {
    return inputText;
  }
  return inputText.slice(0, DESCRIPTION_LENGTH - 2) + `...`;
};

const createMovieTemplate = (movie) => {
  const {title, totalRating, poster, runTime, genre, release, description} = movie.filmInfo;
  const {watchlist, alreadyWatched, favorite} = movie.userDetails;
  const duration = humanizeDuration(runTime);
  const year = release.date.getFullYear();
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating.toString()}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre.length > 0 ? genre[0] : ``}</span>
      </p>
      <img src="./${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${cropDescription(description)}</p>
      <a class="film-card__comments">${movie.comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlist ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${alreadyWatched ? `film-card__controls-item--active` : ``}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${favorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class Movie extends AbstractView {
  constructor(movie) {
    super();
    this._movie = movie;

    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);

    this._openDetailedHandler = this._openDetailedHandler.bind(this);
  }

  getTemplate() {
    return createMovieTemplate(this._movie);
  }

  _openDetailedHandler(evt) {
    evt.preventDefault();
    this._callback.openClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoritesClick();
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  setFavoritesClickHandler(callback) {
    this._callback.favoritesClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setOpenDetailedHandler(callback) {
    this._callback.openClick = callback;
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._openDetailedHandler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._openDetailedHandler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._openDetailedHandler);
  }
}
