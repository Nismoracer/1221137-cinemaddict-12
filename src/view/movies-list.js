import {createElement} from "../util.js";

export const createMoviesListTemplate = () => {
  return (
    `<div class="films-list__container"></div>`
  );
};

export default class MoviesList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMoviesListTemplate();
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
