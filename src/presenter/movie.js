import MovieView from "../view/movie.js";
import Popup from "./popup.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";
import {UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  DETAILED: `DETAILED`
};

export default class Movie {
  constructor(moviesListContainer, changeData, changeMode, api) {
    this._moviesListContainer = moviesListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._api = api;
    this._mode = Mode.DEFAULT;

    this._movieComponent = null;
    this._movieDetailedComponent = null;

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);
    this._setViewDefault = this._setViewDefault.bind(this);

    this._handleDetailedOpenClick = this._handleDetailedOpenClick.bind(this);
  }

  init(movie) {
    this._movie = movie;
    const prevMovieComponent = this._movieComponent;

    this._movieComponent = new MovieView(movie);
    this._movieDetailedPresenter = new Popup(this._movie, this._setViewDefault, this._changeData, this._api);

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
      this._movieDetailedPresenter.hideDetailedMovie();
    }
  }

  destroy() {
    remove(this._movieComponent);
    if (this._movieDetailedComponent) {
      remove(this._movieDetailedComponent);
    }
  }

  _showDetailedMovie() {
    this._changeMode();
    this._movieDetailedPresenter._getComments();
    this._movieDetailedPresenter.init();
    this._mode = Mode.DETAILED;
  }

  _setViewDefault() {
    this._mode = Mode.DEFAULT;
  }

  _handleDetailedOpenClick() {
    this._showDetailedMovie();
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
