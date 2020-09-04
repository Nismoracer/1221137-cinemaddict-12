import AbstractView from "./abstract.js";

const createFooterStatisticsTemplate = (moviesInside) => {
  return (
    `<section class="footer__statistics">
      <p>${moviesInside} movies inside</p>
    </section>`
  );
};

export default class FooterStatistics extends AbstractView {
  constructor(movies) {
    super();
    this._movies = movies;
  }
  getTemplate() {
    return createFooterStatisticsTemplate(this._movies);
  }
}
