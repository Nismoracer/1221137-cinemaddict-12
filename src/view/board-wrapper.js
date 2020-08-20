import {createElement} from "../util.js";

export const createBoardWrapperTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class BoardWrapper {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createBoardWrapperTemplate();
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
