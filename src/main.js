import {render, RenderPosition} from "./utils/render.js";
import {filter} from "./utils/filter.js";
import {generateMovie} from "./mock/movie.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";
import UserView from "./view/user-level.js";
import FooterStatisticsView from "./view/footer-statistics.js";

const MAIN_MOVIES = 20;

const movies = new Array(MAIN_MOVIES).fill().map(generateMovie);

const siteHeader = document.querySelector(`header`);
const siteMain = document.querySelector(`main`);
const footer = document.querySelector(`footer`);

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();
moviesModel.setMovies(movies);
let userInfo = filter[`history`](moviesModel.getMovies()).length;

const userStatus = new UserView(userInfo);

const updateUserStatus = () => {
  userInfo = filter[`history`](moviesModel.getMovies()).length;
  userStatus.updateValue(userInfo);
  userStatus.updateElement();
};

render(siteHeader, userStatus, RenderPosition.BEFOREEND);

const boardPresenter = new BoardPresenter(siteMain, moviesModel, filterModel, updateUserStatus);
const filterPresenter = new FilterPresenter(siteMain, filterModel, moviesModel);

filterPresenter.init();
boardPresenter.init();

render(footer, new FooterStatisticsView(moviesModel.getMovies().length), RenderPosition.BEFOREEND);
