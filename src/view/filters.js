import AbstractView from "./abstract.js";
import {FilterType} from "../const.js";

const createFilterTemplate = (filters, currentFilterType) => {
  const history = filters.filter((filter) => filter.name === `History`).map((filter) => filter.count);
  const favorites = filters.filter((filter) => filter.name === `Favorites`).map((filter) => filter.count);
  const watchlist = filters.filter((filter) => filter.name === `Watchlist`).map((filter) => filter.count);
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item ${currentFilterType === FilterType.ALL ? `main-navigation__item--active` : ``}" data-filter-type="${FilterType.ALL}">All movies</a>
        <a href="#watchlist" class="main-navigation__item ${currentFilterType === FilterType.WATCHLIST ? `main-navigation__item--active` : ``}" data-filter-type="${FilterType.WATCHLIST}">Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
        <a href="#history" class="main-navigation__item ${currentFilterType === FilterType.HISTORY ? `main-navigation__item--active` : ``}" data-filter-type="${FilterType.HISTORY}">History <span class="main-navigation__item-count">${history}</span></a>
        <a href="#favorites" class="main-navigation__item ${currentFilterType === FilterType.FAVORITES ? `main-navigation__item--active` : ``}" data-filter-type="${FilterType.FAVORITES}">Favorites <span class="main-navigation__item-count">${favorites}</span></a>
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== `A`) {
      return;
    }
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }
}
