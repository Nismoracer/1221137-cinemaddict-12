import {humanizeDuration, humanizeReleaseDate, humanizeCommentDate} from "../utils/movie.js";
import {createElement} from "../utils/render.js";
import Smart from "./smart.js";

const filePathEmojes = `./images/emoji/`;

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
const getEmojiIcon = (inputString = `smile`) => {
  return filePathEmojes + inputString + `.png`;
};

const getEmojiTemplate = (smile) => {
  return (
    `<div for="add-emoji" class="film-details__add-emoji-label">
      <img src="${getEmojiIcon(smile)}" width="55" height="55" alt="emoji-smile">
    </div>`
  );
};

const createCommentsString = (comments) => {
  let commentsString = ``;
  for (const comment of comments) {
    commentsString +=
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${getEmojiIcon(comment.emotion)}" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${comment.comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${humanizeCommentDate(comment.date)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
  }
  return commentsString;
};

const createFilmDetailsTemplate = (movie) => {
  const {poster, title, rating, createDate, duration, genres, description, comments, altTitle,
    director, writers, actors, country, restriction, userDetails} = movie;
  const runTime = humanizeDuration(duration);
  const releaseDate = humanizeReleaseDate(createDate);
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

              <p class="film-details__age">${restriction}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${altTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${runTime}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                    ${createGenresString(genres)}
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${userDetails.watchlist ? `checked` : ``}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched"  ${userDetails.alreadyWatched ? `checked` : ``}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite"  ${userDetails.favorite ? `checked` : ``}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${createCommentsString(comments)}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class MovieDetailed extends Smart {
  constructor(movie) {
    super();
    this._movie = movie;
    this._data = Object.assign({}, movie);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._closeDetailedHandler = this._closeDetailedHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
  }

  _closeDetailedHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setCloseDetailedHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeDetailedHandler);
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
    this.getElement().querySelector(`#watchlist`).addEventListener(`change`, this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`#watched`).addEventListener(`change`, this._watchedClickHandler);
  }

  setFavoritesClickHandler(callback) {
    this._callback.favoritesClick = callback;
    this.getElement().querySelector(`#favorite`).addEventListener(`change`, this._favoriteClickHandler);
  }

  _changeEmojiLogo(smile) {
    const currentElement = this.getElement().querySelector(`.film-details__add-emoji-label`);
    const parentElement = currentElement.parentElement;
    const newElement = createElement(getEmojiTemplate(smile));
    parentElement.replaceChild(newElement, currentElement);
  }

  _emojiChangeHandler(evt) {
    evt.preventDefault();
    switch (evt.target.id) {
      case `emoji-smile`:
        this._changeEmojiLogo(`smile`);
        break;
      case `emoji-sleeping`:
        this._changeEmojiLogo(`sleeping`);
        break;
      case `emoji-puke`:
        this._changeEmojiLogo(`puke`);
        break;
      case `emoji-angry`:
        this._changeEmojiLogo(`angry`);
        break;
    }
  }

  setEmojiChangeHandler() {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, this._emojiChangeHandler);
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._movie);
  }
}
