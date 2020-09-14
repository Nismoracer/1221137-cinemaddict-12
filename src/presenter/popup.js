import MovieDetailedView from "../view/movie-detailed.js";
import CommentModel from "../model/comments.js";
import {UserAction, UpdateType} from "../const.js";

export default class Popup {
  constructor(setViewDefault, changeData) {
    this._changeData = changeData;
    this._setViewDefault = setViewDefault;
    this._commentsModel = new CommentModel();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._pressKeyDownHandler = this._pressKeyDownHandler.bind(this);
    this.hideDetailedMovie = this.hideDetailedMovie.bind(this);

    this._commentsModel.addObserver(this._handleModelEvent);
  }
  init(movie) {
    this._movie = movie;
    this._isCtrlPressed = false;
    this._commentsModel.setComments(this._movie.commentsDetailed);
    const comments = this._commentsModel.getComments();

    this._movieDetailedComponent = new MovieDetailedView();
    this._movieDetailedComponent.init(this._movie, comments);
    this._setDetailedHandlers();
  }

  _setDetailedHandlers() {
    this._movieDetailedComponent._setDeleteCommentHandler(this._handleViewAction);
    this._movieDetailedComponent._setEmojiChangeHandler();
    this._movieDetailedComponent.setCloseDetailedHandler(this.hideDetailedMovie);
    document.addEventListener(`keydown`, this._pressKeyDownHandler);
  }

  hideDetailedMovie() {
    document.removeEventListener(`keydown`, this._pressKeyDownHandler);
    this._updateCheckedButtons();
    this._movieDetailedComponent.getElement().remove();
    this._setViewDefault();
  }

  _updateCheckedButtons() {
    const {watchlistState, favoriteState, watchedState} = this._movieDetailedComponent._checkButtonsStates();
    if (this._movie.userDetails.watchlist === watchlistState &&
      this._movie.userDetails.favorite === favoriteState &&
      this._movie.userDetails.alreadyWatched === watchedState) {
      return;
    }
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

  _pressKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.hideDetailedMovie();
    }
    if (evt.key === `Control` || evt.key === `Meta`) {
      this._isCtrlPressed = true;
    } else if (evt.key === `Enter` && this._isCtrlPressed) {
      this._movieDetailedComponent._handleFormSubmit(this._handleViewAction);
      this._isCtrlPressed = false;
    }
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

  _handleModelEvent(actionType, update) {
    switch (actionType) {
      case UserAction.ADD_ELEMENT:
        this._movieDetailedComponent._comments = this._commentsModel.getComments();
        this._movieDetailedComponent.updateElement();
        this._setDetailedHandlers();
        break;
      case UserAction.DELETE_ELEMENT:
        const deletedComment = Object.values(update)[0];
        const updatedComments = this._movie.comments.slice().filter((id) => id !== deletedComment);
        this._changeData(
            UpdateType.PATCH,
            Object.assign({}, this._movie, {comments: updatedComments})
        );
        this._movieDetailedComponent._comments = this._commentsModel.getComments();
        this._movieDetailedComponent.updateElement();
        this._setDetailedHandlers();
        break;
    }
  }
}
