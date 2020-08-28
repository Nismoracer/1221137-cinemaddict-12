import AbstractView from "./abstract.js";

export const createEmptyListTemplate = () => {
  return (
    `<h2 class="films-list__title">There are no movies in our database</h2>`
  );
};

export default class EmptyList extends AbstractView {

  getTemplate() {
    return createEmptyListTemplate();
  }
}
