import {render, RenderPosition} from "./utils/render.js";
import {filter} from "./utils/filter.js";
import {UpdateType} from "./const.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";
import UserView from "./view/user-level.js";
import FooterStatisticsView from "./view/footer-statistics.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic MUh34dfSlosh2Ped`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const siteHeader = document.querySelector(`header`);
const siteMain = document.querySelector(`main`);
const footer = document.querySelector(`footer`);

const api = new Api(END_POINT, AUTHORIZATION);

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();
const userStatus = new UserView();

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(UpdateType.INIT, movies);
    render(footer, new FooterStatisticsView(moviesModel.getMovies().length), RenderPosition.BEFOREEND);
  })
  .catch(() => {
    moviesModel.setMovies(UpdateType.INIT, []);
    render(footer, new FooterStatisticsView(moviesModel.getMovies().length), RenderPosition.BEFOREEND);
  });

const updateUserStatus = () => {
  const userInfo = filter[`history`](moviesModel.getMovies()).length;
  userStatus.updateValue(userInfo);
  userStatus.updateElement();
};

render(siteHeader, userStatus, RenderPosition.BEFOREEND);

const boardPresenter = new BoardPresenter(siteMain, moviesModel, filterModel, updateUserStatus, api);
const filterPresenter = new FilterPresenter(siteMain, filterModel, moviesModel);

filterPresenter.init();
boardPresenter.init();
