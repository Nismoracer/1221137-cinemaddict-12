import AbstractView from "./abstract.js";

export const createMoviesListTemplate = () => {
  return (
    `<div class="films-list__container"></div>`
  );
};

export default class MoviesList extends AbstractView {

  getTemplate() {
    return createMoviesListTemplate();
  }
}
