import AbstractView from "./abstract.js";

const createBoardWrapperTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class BoardWrapper extends AbstractView {

  getTemplate() {
    return createBoardWrapperTemplate();
  }
}
