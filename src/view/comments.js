import {humanizeCommentDate} from "../utils/movie.js";
import {createElement} from "../utils/render.js";
import {UserAction} from "../const.js";
import Smart from "./smart.js";
import he from "he";

const filePathEmojes = `./images/emoji/`;

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

const createCommentsString = (comments, isDeleting) => {
  let commentsString = ``;
  for (const comment of comments) {
    commentsString +=
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${getEmojiIcon(comment.emotion)}" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${humanizeCommentDate(comment.date)}</span>
          <button class="film-details__comment-delete" data-id="${comment.id}"
          ${(isDeleting) ? `disabled` : ``}>
          ${(isDeleting === comment.id) ? `Deleting...` : `Delete`}</button>
        </p>
      </div>
    </li>`;
  }
  return commentsString;
};

const createCommentsTemplate = (comments, isDeleting) => {
  return (
    `<div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
        <ul class="film-details__comments-list">
          ${createCommentsString(comments, isDeleting)}
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
    </div>`
  );
};

export default class Comments extends Smart {
  constructor(comments, isDeleting) {
    super();
    this._comments = comments;
    this._emoji = ``;
    this._isDeleting = isDeleting;

    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
    this._handleDeleteComment = this._handleDeleteComment.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this.lockForm = this.lockForm.bind(this);
    this.lockForDelete = this.lockForDelete.bind(this);
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
        this._emoji = `smile`;
        break;
      case `emoji-sleeping`:
        this._changeEmojiLogo(`sleeping`);
        this._emoji = `sleeping`;
        break;
      case `emoji-puke`:
        this._changeEmojiLogo(`puke`);
        this._emoji = `puke`;
        break;
      case `emoji-angry`:
        this._changeEmojiLogo(`angry`);
        this._emoji = `angry`;
        break;
    }
  }

  _handleFormSubmit(callback) {
    const textArea = this.getElement().querySelector(`.film-details__comment-input`);
    if (textArea.value === `` || this._emoji === ``) {
      return;
    }
    callback(UserAction.ADD_ELEMENT, {
      id: null,
      emotion: this._emoji,
      author: null,
      comment: textArea.value,
      date: new Date()
    });
  }

  _setEmojiChangeHandler() {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, this._emojiChangeHandler);
  }

  _handleDeleteComment(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `BUTTON`) {
      return;
    }
    const index = this._comments.findIndex((comment) => comment.id === evt.target.dataset.id);
    this._callback._deleteComment(UserAction.DELETE_ELEMENT, this._comments[index]);
  }

  _setDeleteCommentHandler(callback) {
    this._callback._deleteComment = callback;
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, this._handleDeleteComment);
  }

  lockForm(state) {
    this.getElement().querySelector(`.film-details__comment-input`).disabled = state;
    const emojes = this.getElement().querySelectorAll(`.film-details__emoji-item`);
    emojes.forEach((emoji) => {
      emoji.disabled = state;
    });
  }

  lockForDelete(state) {
    const buttons = this.getElement().querySelectorAll(`.film-details__comment-delete`);
    buttons.forEach((button) => {
      button.disabled = state;
    });
  }

  getTemplate() {
    return createCommentsTemplate(this._comments, this._isDeleting);
  }
}
