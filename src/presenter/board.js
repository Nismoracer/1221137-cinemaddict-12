import SortView from "../view/sort.js";
import BoardWrapperView from "../view/board-wrapper";
import BoardView from "../view/board.js";
import MoviesListView from "../view/movies-list.js";
import EmptyListView from "../view/no-movies.js";
import MovieView from "../view/movie.js";
import MovieDetailedView from "../view/movie-detailed.js";
import LoadMoreView from "../view/load-more.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {SortType} from "../const.js";
import {sortByDate, sortByRating} from "../utils/movie.js";

const MOVIES_COUNT_PER_STEP = 5;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedMovies = MOVIES_COUNT_PER_STEP;
    this._openedPopup = null;
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = new SortView();
    this._boardWrapperComponent = new BoardWrapperView();
    this._boardComponent = new BoardView();
    this._moviesListComponent = new MoviesListView();
    this._emptyListComponent = new EmptyListView();
    this._loadMoreComponent = new LoadMoreView();
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(movies) {
    this._movies = movies.slice();
    this._defaultMovies = movies.slice();
    this._renderSort();
    render(this._boardContainer, this._boardWrapperComponent, RenderPosition.BEFOREEND);
    render(this._boardWrapperComponent, this._boardComponent, RenderPosition.BEFOREEND);
    this._renderBoard();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortMovies(sortType);
    this._clearMoviesList();
    this._renderMoviesList();
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _sortMovies(sortType) {
    switch (sortType) {
      case SortType.BY_DATE:
        this._movies.sort(sortByDate);
        break;
      case SortType.BY_RATING:
        this._movies.sort(sortByRating);
        break;
      default:
        this._movies = this._defaultMovies.slice();
    }
    this._currentSortType = sortType;
  }

  _renderMovie(movie) {
    const movieComponent = new MovieView(movie);
    const movieDetailedComponent = new MovieDetailedView(movie);

    const showDetailedMovie = () => {
      if (this._openedPopup) {
        remove(this._openedPopup);
        this._openedPopup = null;
      }
      render(this._boardContainer, movieDetailedComponent, RenderPosition.BEFOREEND);
      document.addEventListener(`keydown`, onEscKeyDown);
      movieDetailedComponent.setCloseDetailedHandler(() => {
        hideDetailedMovie();
      });
      this._openedPopup = movieDetailedComponent;
    };

    const hideDetailedMovie = () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
      remove(movieDetailedComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        hideDetailedMovie();
      }
    };

    movieComponent.setOpenDetailedHandler(() => {
      showDetailedMovie();
    });

    render(this._moviesListComponent, movieComponent, RenderPosition.BEFOREEND);
  }

  _clearMoviesList() {
    this._moviesListComponent.getElement().innerHTML = ``;
    this._renderedMovies = MOVIES_COUNT_PER_STEP;
  }

  _renderMoviesList() {
    render(this._boardComponent, this._moviesListComponent, RenderPosition.BEFOREEND);
    this._renderMovies(0, Math.min(this._movies.length, MOVIES_COUNT_PER_STEP));

    if (this._movies.length > MOVIES_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderMovies(from, to) {
    this._movies
    .slice(from, to)
    .forEach((movie) => this._renderMovie(movie));
  }

  _renderNoMovies() {
    this._boardComponent.getElement().innerHTML = ``;
    render(this._boardComponent, this._emptyListComponent, RenderPosition.BEFOREEND);
  }

  _handleLoadMoreButtonClick() {
    this._renderMovies(this._renderedMovies, this._renderedMovies + MOVIES_COUNT_PER_STEP);
    this._renderedMovies += MOVIES_COUNT_PER_STEP;

    if (this._renderedMovies >= this._movies.length) {
      remove(this._loadMoreComponent);
    }
  }

  _renderLoadMoreButton() {
    render(this._boardComponent, this._loadMoreComponent, RenderPosition.BEFOREEND);

    this._loadMoreComponent.setLoadMoreHandler(this._handleLoadMoreButtonClick);
  }

  _renderBoard() {
    if (this._movies.length === 0) {
      this._renderNoMovies();
      return;
    }
    this._renderMoviesList();
  }
}
