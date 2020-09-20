import SortView from "../view/sort.js";
import BoardView from "../view/board.js";
import MoviesListView from "../view/movies-list.js";
import EmptyListView from "../view/no-movies.js";
import LoadMoreView from "../view/load-more.js";
import LoadingView from "../view/loading.js";
import MoviePresenter from "./movie.js";
import {filter} from "../utils/filter.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {SortType, UpdateType} from "../const.js";
import {sortByDate, sortByRating} from "../utils/movie.js";

const MOVIES_COUNT_PER_STEP = 5;

export default class Board {
  constructor(boardContainer, moviesModel, filterModel, updateUserStatus, api) {
    this._moviesModel = moviesModel;
    this._api = api;
    this._updateUserStatus = updateUserStatus;
    this._boardContainer = boardContainer;
    this._filterModel = filterModel;
    this._renderedMovies = MOVIES_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._moviePresentersMap = new Map();

    this._sortComponent = null;
    this._loadMoreComponent = null;
    this._isLoading = true;

    this._boardComponent = new BoardView();
    this._moviesListComponent = new MoviesListView();
    this._emptyListComponent = new EmptyListView();
    this._loadingComponent = new LoadingView();
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this.updateContainer = this.updateContainer.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderBoard();
  }

  destroy() {
    this._clearBoard({resetRenderedMoviesCount: true, resetSortType: true});
  }

  updateContainer(boardWrapperComponent) {
    this._boardContainer = boardWrapperComponent;
  }

  _getMovies() {
    const filterType = this._filterModel.getFilter();
    const movies = this._moviesModel.getMovies();
    const filtredMovies = filter[filterType](movies);

    switch (this._currentSortType) {
      case SortType.BY_DATE:
        return filtredMovies.sort(sortByDate);
      case SortType.BY_RATING:
        return filtredMovies.sort(sortByRating);
    }
    return filtredMovies;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearBoard({resetRenderedMoviesCount: true});
    this._renderBoard();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._boardComponent, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _handleViewAction(updateType, update) {
    this._api.updateMovie(update).then((response) => {
      this._moviesModel.updateMovie(updateType, response);
    });
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._moviePresentersMap[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._updateUserStatus();
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedMoviesCount: true, resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._updateUserStatus();
        this._renderBoard();
        break;
    }
  }

  _handleModeChange() {
    Object
      .values(this._moviePresentersMap)
      .forEach((presenter) => presenter.resetView());
  }

  _renderMovie(movie) {
    const MoviePresent = new MoviePresenter(this._moviesListComponent, this._handleViewAction, this._handleModeChange);
    MoviePresent.init(movie);
    this._moviePresentersMap[movie.id] = MoviePresent;
  }

  _renderMovies(movies) {
    movies.forEach((movie) => this._renderMovie(movie));
  }

  _renderLoading() {
    render(this._boardComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoMovies() {
    this._boardComponent.getElement().innerHTML = ``;
    render(this._boardComponent, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _handleLoadMoreButtonClick() {
    const moviesCount = this._getMovies().length;
    const newRenderedMoviesCount = Math.min(moviesCount, this._renderedMovies + MOVIES_COUNT_PER_STEP);
    const movies = this._getMovies().slice(this._renderedMovies, newRenderedMoviesCount);

    this._renderMovies(movies);
    this._renderedMovies = newRenderedMoviesCount;

    if (this._renderedMovies >= moviesCount) {
      remove(this._loadMoreComponent);
    }
  }

  _renderLoadMoreButton() {
    if (this._loadMoreComponent !== null) {
      this._loadMoreComponent = null;
    }
    this._loadMoreComponent = new LoadMoreView();
    this._loadMoreComponent.setLoadMoreHandler(this._handleLoadMoreButtonClick);
    render(this._boardComponent, this._loadMoreComponent, RenderPosition.BEFOREEND);
  }

  _clearBoard({resetRenderedMoviesCount = false, resetSortType = false} = {}) {
    const moviesCount = this._getMovies().length;

    Object
      .values(this._moviePresentersMap)
      .forEach((presenter) => presenter.destroy());
    this._moviePresentersMap = {};

    remove(this._sortComponent);
    remove(this._emptyListComponent);
    remove(this._loadMoreComponent);
    remove(this._loadingComponent);

    if (resetRenderedMoviesCount) {
      this._renderedMovies = MOVIES_COUNT_PER_STEP;
    } else {
      this._renderedMovies = Math.min(moviesCount, this._renderedMovies);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const movies = this._getMovies();
    const moviesCount = movies.length;

    this._renderSort();
    if (moviesCount === 0) {
      this._renderNoMovies();
      return;
    }

    render(this._boardComponent, this._moviesListComponent, RenderPosition.BEFOREEND);
    this._renderMovies(movies.slice(0, Math.min(moviesCount, this._renderedMovies)));

    if (moviesCount > this._renderedMovies) {
      this._renderLoadMoreButton();
    }
  }
}
