import {createUserLevelTemplate} from "./view/user-level.js";
import {createMenuTemplate} from "./view/menu.js";
import {createBoardTemplate} from "./view/board.js";
import {createMovieTemplate} from "./view/movie.js";
import {createRatedMovieTemplate} from "./view/rated-movie.js";
import {createCommentedMovieTemplate} from "./view/commented-movie.js";
import {createLoadMoreButton} from "./view/load-more.js";
import {createfooterStatisticsTemplate} from "./view/footer-statistics.js";
import {createFilmDetailsTemplate} from "./view/movie-detailed.js";
import {generateMovie} from "./mock/movie.js";
import {generateFilter} from "./mock/filter.js";

const MAIN_MOVIES = 20;
const TOP_MOVIES = 2;
const MOVIES_COUNT_PER_STEP = 5;

const movies = new Array(MAIN_MOVIES).fill().map(generateMovie);
const filters = generateFilter(movies);
const userInfo = filters.filter((filter) => filter.name === `history`).map((filter) => filter.count);

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const footerStatistics = document.querySelector(`.footer__statistics`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeader, createUserLevelTemplate(userInfo), `beforeend`);
render(siteMain, createMenuTemplate(filters), `beforeend`);
render(siteMain, createBoardTemplate(), `beforeend`);

const boardMain = siteMain.querySelector(`.films`);
const boardMainList = boardMain.querySelector(`.films-list`);
const boardMainListContainer = boardMainList.querySelector(`.films-list__container`);

for (let i = 0; i < Math.min(movies.length, MOVIES_COUNT_PER_STEP); i++) {
  render(boardMainListContainer, createMovieTemplate(movies[i]), `beforeend`);
}

if (movies.length > MOVIES_COUNT_PER_STEP) {
  let renderedMovieCount = MOVIES_COUNT_PER_STEP;

  render(boardMainList, createLoadMoreButton(), `beforeend`);

  const loadMoreButton = siteMain.querySelector(`.films-list__show-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    movies
      .slice(renderedMovieCount, renderedMovieCount + MOVIES_COUNT_PER_STEP)
      .forEach((movie) => render(boardMainListContainer, createMovieTemplate(movie), `beforeend`));

    renderedMovieCount += MOVIES_COUNT_PER_STEP;

    if (renderedMovieCount >= movies.length) {
      loadMoreButton.remove();
    }
  });
}

const boardRatedListContainer = boardMain.querySelector(`.films-list--rated .films-list__container`);
const boardCommentedListContainer = boardMain.querySelector(`.films-list--commented .films-list__container`);

for (let i = 0; i < TOP_MOVIES; i++) {
  render(boardRatedListContainer, createRatedMovieTemplate(), `beforeend`);
  render(boardCommentedListContainer, createCommentedMovieTemplate(), `beforeend`);
}

render(footerStatistics, createfooterStatisticsTemplate(movies.length), `beforeend`);

render(footerStatistics, createFilmDetailsTemplate(movies[0]), `afterend`);
