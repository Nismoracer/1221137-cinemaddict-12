import AbstractView from "./abstract.js";

const createBoardTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>`
  );
};

export default class BoardView extends AbstractView {

  getTemplate() {
    return createBoardTemplate();
  }
}
