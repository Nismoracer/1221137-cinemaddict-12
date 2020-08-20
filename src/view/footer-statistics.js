import {createElement} from "../util.js";

const createfooterStatisticsTemplate = (moviesInside) => {
  return (
    `<section class="footer__statistics">
      <p>${moviesInside} movies inside</p>
    </section>`
  );
};

export default class FooterStatistics {
  constructor(movies) {
    this._element = null;
    this._movies = movies;
  }

  getTemplate() {
    return createfooterStatisticsTemplate(this._movies);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
