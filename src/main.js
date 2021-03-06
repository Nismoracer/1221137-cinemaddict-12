import {remove, render, RenderPosition} from "./utils/render.js";
import {filter} from "./utils/filter.js";
import {UpdateType, FilterType} from "./const.js";
import MoviesModel from "./model/movies.js";
import FilterModel from "./model/filter.js";
import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";
import UserView from "./view/user-level.js";
import MenuView from "./view/menu.js";
import BoardWrapperView from "./view/board-wrapper";
import StatisticsView from "./view/statistics.js";
import FooterStatisticsView from "./view/footer-statistics.js";
import Api, {END_POINT, AUTHORIZATION} from "./api/api.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const STORE_PREFIX = `kinoman-localmovies`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const siteHeader = document.querySelector(`header`);
const siteMain = document.querySelector(`main`);
const footer = document.querySelector(`footer`);

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();
const userStatus = new UserView();
const menuComponent = new MenuView();
let boardWrapperComponent = new BoardWrapperView();
let statisticsComponent = null;

const updateUserStatus = () => {
  const userInfo = filter[FilterType.HISTORY](moviesModel.getMovies()).length;
  userStatus.updateValue(userInfo);
  userStatus.updateElement();
};

const handleMenuClick = () => {
  if (statisticsComponent) {
    return;
  }
  const statMenu = menuComponent.getElement().querySelector(`.main-navigation__additional`);
  statMenu.classList.add(`main-navigation__additional--active`);
  const filters = document.querySelectorAll(`.main-navigation__item`);
  filters.forEach((index) => index.classList.remove(`main-navigation__item--active`));
  boardPresenter.destroy();
  filterPresenter.currentFilter = null;
  remove(boardWrapperComponent);
  statisticsComponent = new StatisticsView(moviesModel.getMovies());
  render(siteMain, statisticsComponent, RenderPosition.BEFOREEND);
};

const removeStatistics = () => {
  if (!statisticsComponent) {
    return;
  }
  const statMenu = menuComponent.getElement().querySelector(`.main-navigation__additional`);
  statMenu.classList.remove(`main-navigation__additional--active`);
  remove(statisticsComponent);
  statisticsComponent = null;
  boardWrapperComponent = new BoardWrapperView();
  render(siteMain, boardWrapperComponent, RenderPosition.BEFOREEND);
  boardPresenter.updateContainer(boardWrapperComponent);
};

render(siteHeader, userStatus, RenderPosition.BEFOREEND);
render(siteMain, menuComponent, RenderPosition.BEFOREEND);
render(siteMain, boardWrapperComponent, RenderPosition.BEFOREEND);

const boardPresenter = new BoardPresenter(boardWrapperComponent, moviesModel, filterModel, updateUserStatus, apiWithProvider);
const filterPresenter = new FilterPresenter(menuComponent, filterModel, moviesModel, removeStatistics);

filterPresenter.init();
boardPresenter.init();

apiWithProvider.getMovies()
  .then((movies) => {
    moviesModel.setMovies(UpdateType.INIT, movies);
    menuComponent.setStatisticsClickHandler(handleMenuClick);
    render(footer, new FooterStatisticsView(moviesModel.getMovies().length), RenderPosition.BEFOREEND);
  })
  .catch(() => {
    moviesModel.setMovies(UpdateType.INIT, []);
    menuComponent.setStatisticsClickHandler(handleMenuClick);
    render(footer, new FooterStatisticsView(moviesModel.getMovies().length), RenderPosition.BEFOREEND);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
