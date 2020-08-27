import {humanizeDuration} from "../utils/movie.js";
import AbstractView from "./abstract.js";

const createMovieTemplate = (movie) => {
  const {poster, title, rating, createDate, duration, genres, description, comments} = movie;
  const hrsMins = humanizeDuration(duration);
  const year = createDate.getFullYear();
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${hrsMins}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class Movie extends AbstractView {
  constructor(movie) {
    super();
    this._movie = movie;
    this._openDetailedHandler = this._openDetailedHandler.bind(this);
  }

  _openDetailedHandler(evt) {
    evt.preventDefault();
    this._callback.openClick();
  }

  setOpenDetailedHandler(callback) {
    this._callback.openClick = callback;
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._openDetailedHandler);
  }

  getTemplate() {
    return createMovieTemplate(this._movie);
  }
}
