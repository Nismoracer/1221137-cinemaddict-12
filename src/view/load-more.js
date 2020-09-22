import AbstractView from "./abstract.js";

const createLoadMoreButton = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class LoadMore extends AbstractView {
  constructor() {
    super();
    this._loadMoreHandler = this._loadMoreHandler.bind(this);
  }

  getTemplate() {
    return createLoadMoreButton();
  }

  _loadMoreHandler(evt) {
    evt.preventDefault();
    this._callback.loadMoreClick();
  }

  setLoadMoreHandler(callback) {
    this._callback.loadMoreClick = callback;
    this.getElement().addEventListener(`click`, this._loadMoreHandler);
  }
}
