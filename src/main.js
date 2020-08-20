import {render, RenderPosition} from "./util.js";
import {generateMovie} from "./mock/movie.js";
import {generateFilter} from "./mock/filter.js";
import FilterView from "./view/menu.js";
import UserView from "./view/user-level.js";
import SortView from "./view/sort.js";
import BoardWrapperView from "./view/board-wrapper";
import BoardView from "./view/board.js";
import MoviesListView from "./view/movies-list.js";
import EmptyListView from "./view/no-movies.js";
import MovieView from "./view/movie.js";
import MovieDetailedView from "./view/movie-detailed.js";
import LoadMoreView from "./view/load-more.js";
import FooterStatisticsView from "./view/footer-statistics.js";

const MAIN_MOVIES = 20;
const MOVIES_COUNT_PER_STEP = 5;

const movies = new Array(MAIN_MOVIES).fill().map(generateMovie);
const filters = generateFilter(movies);
const userInfo = filters.filter((filter) => filter.name === `history`).map((filter) => filter.count);

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);

const renderMovie = (moviesList, movie) => {
  const movieComponent = new MovieView(movie);
  const movieDetailedComponent = new MovieDetailedView(movie);

  const onCloseBtnClick = () => {
    removeDetailedMovie();
  };

  const showDetailedMovie = () => {
    render(siteMain, movieDetailedComponent.getElement(), RenderPosition.BEFOREEND);
    movieDetailedComponent.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, onCloseBtnClick);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const removeDetailedMovie = () => {
    document.removeEventListener(`keydown`, onEscKeyDown);
    movieDetailedComponent.getElement().remove();
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      removeDetailedMovie();
    }
  };

  movieComponent.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, () => {
    showDetailedMovie();
  });

  render(moviesList, movieComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderBoard = (boardContainer, boardMovies) => {
  const boardWrapperComponent = new BoardWrapperView();
  const boardComponent = new BoardView();
  const moviesList = new MoviesListView();
  render(boardContainer, boardWrapperComponent.getElement(), RenderPosition.BEFOREEND);
  render(boardWrapperComponent.getElement(), boardComponent.getElement(), RenderPosition.BEFOREEND);
  if (boardMovies.length === 0) {
    while (boardComponent.getElement().firstChild) {
      boardComponent.getElement().removeChild(boardComponent.getElement().firstChild);
    }
    render(boardComponent.getElement(), new EmptyListView().getElement(), RenderPosition.BEFOREEND);
    return;
  }
  render(boardComponent.getElement(), moviesList.getElement(), RenderPosition.BEFOREEND);

  boardMovies
    .slice(0, Math.min(movies.length, MOVIES_COUNT_PER_STEP))
    .forEach((movie) => renderMovie(moviesList.getElement(), movie));

  if (boardMovies.length > MOVIES_COUNT_PER_STEP) {
    let renderedMoviesCount = MOVIES_COUNT_PER_STEP;

    const loadMore = new LoadMoreView();
    render(boardComponent.getElement(), loadMore.getElement(), RenderPosition.BEFOREEND);

    loadMore.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      boardMovies
        .slice(renderedMoviesCount, renderedMoviesCount + MOVIES_COUNT_PER_STEP)
        .forEach((movie) => renderMovie(moviesList.getElement(), movie));

      renderedMoviesCount += MOVIES_COUNT_PER_STEP;

      if (renderedMoviesCount >= movies.length) {
        loadMore.getElement().remove();
        loadMore.removeElement();
      }
    });
  }
};

render(siteHeader, new UserView(userInfo).getElement(), RenderPosition.BEFOREEND);
render(siteMain, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);
render(siteMain, new SortView().getElement(), RenderPosition.BEFOREEND);
renderBoard(siteMain, movies);
const footer = document.querySelector(`footer`);
render(footer, new FooterStatisticsView(movies.length).getElement(), RenderPosition.BEFOREEND);
