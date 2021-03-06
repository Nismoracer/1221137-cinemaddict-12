import MovieDetailedView from "../view/movie-detailed.js";
import CommentModel from "../model/comments.js";
import CommentsView from "../view/comments.js";
import {UserAction, UpdateType} from "../const.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import Api, {END_POINT, AUTHORIZATION} from "../api/api.js";
import Store from "../api/store.js";
import Provider from "../api/provider.js";

const STORE_PREFIX = `kinoman-localcomments`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

export default class Popup {
  constructor(movie, setViewDefault, changeData) {
    this._movie = movie;
    this._changeData = changeData;
    this._setViewDefault = setViewDefault;
    this._commentsModel = new CommentModel();

    this._api = new Api(END_POINT, AUTHORIZATION);
    const store = new Store(STORE_NAME, window.localStorage);
    this._apiWithProvider = new Provider(this._api, store, this._renderComments);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._pressKeyDownHandler = this._pressKeyDownHandler.bind(this);
    this.hideDetailedMovie = this.hideDetailedMovie.bind(this);
    this._renderComments = this._renderComments.bind(this);

    this._commentsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._isCtrlPressed = false;
    this._movieDetailedComponent = new MovieDetailedView();
    this._movieDetailedComponent.init(this._movie, this._comments, this._isCommentsActive);
    this._movieDetailedComponent.setCloseDetailedHandler(this.hideDetailedMovie);
    document.addEventListener(`keydown`, this._pressKeyDownHandler);
    window.addEventListener(`online`, this._renderComments);
    window.addEventListener(`offline`, this._renderComments);
  }

  _renderComments() {
    const commentsContainer = this._movieDetailedComponent.getElement().querySelector(`form`);
    if (this._commentsComponent) {
      remove(this._commentsComponent);
    }

    this._commentsComponent = new CommentsView(this._comments, this._isDeleting);
    render(commentsContainer, this._commentsComponent, RenderPosition.BEFOREEND);
    this._commentsComponent.lockForm(!Provider.isOnline());
    this._commentsComponent.lockForDelete(!Provider.isOnline());
    this._commentsComponent._setDeleteCommentHandler(this._handleViewAction);
    this._commentsComponent._setEmojiChangeHandler();
  }

  _getComments() {
    this._isCommentsActive = false;
    this._comments = [];

    this._apiWithProvider.requestComments(this._movie.id)
    .then((comments) => {
      this._commentsModel.setComments(UpdateType.INIT, comments);
    })
    .catch(() => {
      this._commentsModel.setComments(UpdateType.INIT, []);
    });
  }

  hideDetailedMovie() {
    document.removeEventListener(`keydown`, this._pressKeyDownHandler);
    this._updateCheckedButtons();
    if (this._commentsComponent) {
      remove(this._commentsComponent);
    }
    this._movieDetailedComponent.getElement().remove();
    this._setViewDefault();
    window.removeEventListener(`online`, this._renderComments);
    window.removeEventListener(`offline`, this._renderComments);
  }

  _updateCheckedButtons() {
    const {watchlistState, favoriteState, watchedState} = this._movieDetailedComponent._checkButtonsStates();
    if (this._movie.userDetails.watchlist === watchlistState &&
      this._movie.userDetails.favorite === favoriteState &&
      this._movie.userDetails.alreadyWatched === watchedState) {
      return;
    }
    let newWatchingDate = this._movie.userDetails.watchingDate;
    if (this._movie.userDetails.alreadyWatched !== watchedState) {
      if (this._movie.userDetails.alreadyWatched) {
        newWatchingDate = null;
      } else {
        newWatchingDate = new Date();
      }
    }

    const userData = Object.assign(
        {}, this._movie.userDetails, {watchlist: watchlistState,
          favorite: favoriteState,
          alreadyWatched: watchedState,
          watchingDate: newWatchingDate
        });
    this._changeData(
        UpdateType.MINOR,
        Object.assign({}, this._movie, {userDetails: userData})
    );
  }

  _setCommentsState(comment) {
    this._isDeleting = comment.id;
    this._renderComments();
  }

  _pressKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.hideDetailedMovie();
    }
    if (evt.key === `Control` || evt.key === `Meta`) {
      this._isCtrlPressed = true;
    } else if (evt.key === `Enter` && this._isCtrlPressed && this._commentsComponent) {
      this._commentsComponent._handleFormSubmit(this._handleViewAction);
      this._isCtrlPressed = false;
    }
  }

  _handleViewAction(actionType, update) {
    switch (actionType) {
      case UserAction.ADD_ELEMENT:
        this._commentsComponent.lockForm(true);
        this._api.addComment(this._movie, update)
        .then((response) => {
          const newComment = CommentModel.adaptToClient(response.comments[response.comments.length - 1]);
          this._changeData(
              UpdateType.PATCH,
              Object.assign({}, this._movie, {comments: response.movie.comments})
          );
          this._commentsModel.addComment(newComment);
          this._renderComments();
        })
        .catch(() => {
          this._movieDetailedComponent.shake();
          this._commentsComponent.lockForm(false);
        });
        break;
      case UserAction.DELETE_ELEMENT:
        this._setCommentsState(update);
        this._api.deleteComment(update)
        .then(() => {
          this._commentsModel.deleteComment(update);
        })
        .catch(() => {
          this._isDeleting = null;
          this._movieDetailedComponent.shake();
          this._renderComments();
        });
        break;
    }
  }

  _handleModelEvent(updateType, update) {

    switch (updateType) {
      case UpdateType.PATCH:
        const deletedComment = Object.values(update)[0];
        const updatedComments = this._movie.comments.slice().filter((id) => id !== deletedComment);
        this._changeData(
            UpdateType.PATCH,
            Object.assign({}, this._movie, {comments: updatedComments})
        );
        this._comments = this._commentsModel.getComments();
        this._isDeleting = null;
        this._renderComments();
        break;

      case UpdateType.INIT:
        this._comments = this._commentsModel.getComments();
        if (this._movie.comments.length === this._comments.length) {
          this._isCommentsActive = true;
          this._isDeleting = null;
          this._renderComments();
        }
        break;
    }
  }
}
