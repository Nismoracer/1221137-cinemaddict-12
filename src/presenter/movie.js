import MovieView from "../view/movie.js";
import MovieDetailedView from "../view/movie-detailed.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";
import {UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  DETAILED: `DETAILED`
};

export default class Movie {
  constructor(moviesListContainer, changeData, changeMode) {
    this._moviesListContainer = moviesListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;

    this._movieComponent = null;
    this._movieDetailedComponent = null;

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);

    this._handleDetailedOpenClick = this._handleDetailedOpenClick.bind(this);
    this._handleDetailedCloseClick = this._handleDetailedCloseClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(movie) {
    this._movie = movie;

    const prevMovieComponent = this._movieComponent;

    this._movieComponent = new MovieView(movie);

    this._movieComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._movieComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._movieComponent.setFavoritesClickHandler(this._handleFavoritesClick);
    this._movieComponent.setOpenDetailedHandler(this._handleDetailedOpenClick);

    if (prevMovieComponent === null) {
      render(this._moviesListContainer, this._movieComponent, RenderPosition.BEFOREEND);
      return;
    }
    if (this._moviesListContainer.getElement().contains(prevMovieComponent.getElement())) {
      replace(this._movieComponent, prevMovieComponent);
    }

    remove(prevMovieComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._hideDetailedMovie();
    }
  }

  destroy() {
    remove(this._movieComponent);
    if (this._movieDetailedComponent) {
      remove(this._movieDetailedComponent);
    }
  }

  _showDetailedMovie() {
    this._movieDetailedComponent = new MovieDetailedView(this._movie, this._changeData);
    this._movieDetailedComponent.init(this);
    this._changeMode();
    this._mode = Mode.DETAILED;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._hideDetailedMovie();
    }
  }

  _setDetailedHandlers() {
    this._movieDetailedComponent._setDeleteCommentHandler();
    this._movieDetailedComponent._setEmojiChangeHandler();
    this._movieDetailedComponent.setCloseDetailedHandler(this._handleDetailedCloseClick);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _hideDetailedMovie() {
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._movieDetailedComponent._checkButtonsStates();
    this._movieDetailedComponent._commentsModel = null;
    remove(this._movieDetailedComponent);
    this._mode = Mode.DEFAULT;
  }

  _handleDetailedOpenClick() {
    this._showDetailedMovie();
  }

  _handleDetailedCloseClick() {
    this._hideDetailedMovie();
  }

  _handleWatchlistClick() {
    const userData = Object.assign(
        {}, this._movie.userDetails, {watchlist: !this._movie.userDetails.watchlist});
    this._changeData(
        UpdateType.MINOR,
        Object.assign({}, this._movie, {userDetails: userData})
    );
  }

  _handleWatchedClick() {
    const userData = Object.assign(
        {}, this._movie.userDetails, {alreadyWatched: !this._movie.userDetails.alreadyWatched,
          watchingDate: (this._movie.userDetails.watchingDate) ? null : new Date()});
    this._changeData(
        UpdateType.MINOR,
        Object.assign({}, this._movie, {userDetails: userData})
    );
  }

  _handleFavoritesClick() {
    const userData = Object.assign(
        {}, this._movie.userDetails, {favorite: !this._movie.userDetails.favorite});
    this._changeData(
        UpdateType.MINOR,
        Object.assign({}, this._movie, {userDetails: userData})
    );
  }
}
