import {humanizeDuration, humanizeReleaseDate, humanizeCommentDate} from "../utils/movie.js";
import {render, RenderPosition, createElement} from "../utils/render.js";
import {UserAction} from "../const.js";
import {UpdateType} from "../const.js";
import CommentModel from "../model/comments.js";
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
          <button class="film-details__comment-delete" data-id="${comment.id}">Delete</button>
        </p>
      </div>
    </li>`;
  }
  return commentsString;
};

const createFilmDetailsTemplate = (movie, comments) => {
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
                  <p class="film-details__total-rating">${totalRating}</p>
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
  constructor(movie, changeData) {
    super();
    this._movie = movie;
    this._changeData = changeData;
    const detailedContainer = document.querySelector(`body`);

    this._closeDetailedHandler = this._closeDetailedHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleDeleteComment = this._handleDeleteComment.bind(this);

    this._commentsModel = new CommentModel();
    this._commentsModel.setComments(this._movie.commentsDetailed);
    this._comments = this._commentsModel.getComments();
    render(detailedContainer, this, RenderPosition.BEFOREEND);

    this._commentsModel.addObserver(this._handleModelEvent);
  }

  init(movieComponent) {
    this._movieComponent = movieComponent;
    this._movieComponent._setDetailedHandlers();
  }

  _handleViewAction(actionType, update) {
    switch (actionType) {
      case UserAction.ADD_ELEMENT:
        this._commentsModel.addComment(update);
        break;
      case UserAction.DELETE_ELEMENT:
        this._commentsModel.deleteComment(update);
        break;
    }
  }

  _handleModelEvent() {
    this._comments = this._commentsModel.getComments();
    this.updateElement();
    this._movieComponent._setDetailedHandlers();
  }

  _handleDeleteComment(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `BUTTON`) {
      return;
    }
    const index = this._comments.findIndex((comment) => comment.id.toString() === evt.target.dataset.id);
    this._handleViewAction(UserAction.DELETE_ELEMENT, this._comments[index]);
  }

  _checkButtonsStates() {
    const watchlistState = this.getElement().querySelector(`#watchlist`).checked;
    const favoriteState = this.getElement().querySelector(`#favorite`).checked;
    const watchedState = this.getElement().querySelector(`#watched`).checked;
    const userData = Object.assign(
        {}, this._movie.userDetails, {watchlist: watchlistState,
          favorite: favoriteState,
          alreadyWatched: watchedState
        });
    this._changeData(
        UpdateType.MINOR,
        Object.assign({}, this._movie, {userDetails: userData})
    );
  }

  _setDeleteCommentHandler() {
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, this._handleDeleteComment);
  }

  _closeDetailedHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setCloseDetailedHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeDetailedHandler);
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

  _setEmojiChangeHandler() {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, this._emojiChangeHandler);
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._movie, this._comments);
  }
}
