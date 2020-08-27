import {render, RenderPosition} from "./utils/render.js";
import {generateMovie} from "./mock/movie.js";
import {generateFilter} from "./mock/filter.js";
import BoardPresenter from "./presenter/board.js";
import FilterView from "./view/menu.js";
import UserView from "./view/user-level.js";
import FooterStatisticsView from "./view/footer-statistics.js";

const MAIN_MOVIES = 20;

const movies = new Array(MAIN_MOVIES).fill().map(generateMovie);
const filters = generateFilter(movies);
const userInfo = filters.filter((filter) => filter.name === `history`).map((filter) => filter.count);

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const footer = document.querySelector(`footer`);

render(siteHeader, new UserView(userInfo), RenderPosition.BEFOREEND);
render(siteMain, new FilterView(filters), RenderPosition.BEFOREEND);

const boardPresenter = new BoardPresenter(siteMain);
boardPresenter.init(movies);

render(footer, new FooterStatisticsView(movies.length), RenderPosition.BEFOREEND);
