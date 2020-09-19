import AbstractView from "./abstract.js";

const createMenuTemplate = () => {
  return (
    `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
  );
};

export default class Menu extends AbstractView {
  constructor() {
    super();
    this._statisticsClickHandler = this._statisticsClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _statisticsClickHandler(evt) {
    evt.preventDefault();
    this._callback.statisticsClick();
  }

  setStatisticsClickHandler(callback) {
    this._callback.statisticsClick = callback;
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, this._statisticsClickHandler);
  }
}
