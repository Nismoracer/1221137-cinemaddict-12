import {createUserLevelTemplate} from "./view/user-level.js";
import {createMenuTemplate} from "./view/menu.js";
import {createBoardTemplate} from "./view/board.js";
import {createMovieTemplate} from "./view/movie.js";
import {createRatedMovieTemplate} from "./view/rated-movie.js";
import {createCommentedMovieTemplate} from "./view/commented-movie.js";
import {createLoadMoreButton} from "./view/load-more.js";
import {createfooterStatisticsTemplate} from "./view/footer-statistics.js";
import {createFilmDetailsTemplate} from "./view/movie-detailed.js";

const MAIN_MOVIES = 5;
const TOP_MOVIES = 2;
const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const footerStatistics = document.querySelector(`.footer__statistics`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeader, createUserLevelTemplate(), `beforeend`);
render(siteMain, createMenuTemplate(), `beforeend`);
render(siteMain, createBoardTemplate(), `beforeend`);

const boardMain = siteMain.querySelector(`.films`);
const boardMainList = boardMain.querySelector(`.films-list`);
const boardMainListContainer = boardMainList.querySelector(`.films-list__container`);

for (let i = 0; i < MAIN_MOVIES; i++) {
  render(boardMainListContainer, createMovieTemplate(), `beforeend`);
}

render(boardMainList, createLoadMoreButton(), `beforeend`);

const boardRatedListContainer = boardMain.querySelector(`.films-list--rated .films-list__container`);
const boardCommentedListContainer = boardMain.querySelector(`.films-list--commented .films-list__container`);

for (let i = 0; i < TOP_MOVIES; i++) {
  render(boardRatedListContainer, createRatedMovieTemplate(), `beforeend`);
  render(boardCommentedListContainer, createCommentedMovieTemplate(), `beforeend`);
}

render(footerStatistics, createfooterStatisticsTemplate(), `beforeend`);

render(footerStatistics, createFilmDetailsTemplate(), `afterend`);
