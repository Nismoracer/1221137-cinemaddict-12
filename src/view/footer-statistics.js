import AbstractView from "./abstract.js";

const createfooterStatisticsTemplate = (moviesInside) => {
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
    return createfooterStatisticsTemplate(this._movies);
  }
}
