import {humanizeDuration, humanizeReleaseDate} from "../utils/movie.js";
import {render, RenderPosition} from "../utils/render.js";
import Smart from "./smart.js";

const SHAKE_ANIMATION_TIMEOUT = 600;

const createGenresString = (genres) => {
  let sumString = genres.length > 1 ?
    `<td class="film-details__term">Genres</td>
    <td class="film-details__cell">` : `<td class="film-details__term">Genre</td>
    <td class="film-details__cell">`;
  for (const genre of genres) {
    sumString += `<span class="film-details__genre">` + genre + `</span>`;
  }
  sumString += `</td>`;
  return sumString;
};

const createFilmDetailsTemplate = (movie) => {
  const {title, alternativeTitle, totalRating, poster, ageRating, runTime,
    genre, director, writers, actors, description, release} = movie.filmInfo;
  const duration = humanizeDuration(runTime);
  const releaseDate = humanizeReleaseDate(release.date);
  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating.toString()}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${release.releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                    ${createGenresString(genre)}
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${movie.userDetails.watchlist ? `checked` : ``}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched"  ${movie.userDetails.alreadyWatched ? `checked` : ``}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite"  ${movie.userDetails.favorite ? `checked` : ``}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class MovieDetailed extends Smart {
  constructor() {
    super();
    this._closeDetailedHandler = this._closeDetailedHandler.bind(this);
  }

  init(movie) {
    this._movie = movie;
    const detailedContainer = document.querySelector(`body`);
    render(detailedContainer, this, RenderPosition.BEFOREEND);
  }

  _checkButtonsStates() {
    const watchlistState = this.getElement().querySelector(`#watchlist`).checked;
    const favoriteState = this.getElement().querySelector(`#favorite`).checked;
    const watchedState = this.getElement().querySelector(`#watched`).checked;
    return {
      watchlistState,
      favoriteState,
      watchedState};
  }

  _closeDetailedHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setCloseDetailedHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeDetailedHandler);
  }

  shake() {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._movie);
  }
}
