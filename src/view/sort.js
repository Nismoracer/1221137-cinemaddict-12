import AbstractView from "./abstract.js";
import {SortType} from "../const.js";

const createSortTemplate = () => {
  return `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
  </ul>`;
};

const changeActiveElement = (evt) => {
  const sortButtons = document.querySelectorAll(`.sort__button`);
  sortButtons.forEach((element) => {
    element.classList.remove(`sort__button--active`);
  });
  evt.classList.add(`sort__button--activen`);
};

export default class Sort extends AbstractView {
  constructor() {
    super();
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }
  getTemplate() {
    return createSortTemplate();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
    changeActiveElement(evt.target);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
