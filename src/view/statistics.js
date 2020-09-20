import SmartView from "./smart.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {filter} from "../utils/filter.js";
import {FilterType, StatisticPeriod} from "../const.js";

const BAR_HEIGHT = 50;

const renderBarsChart = (statisticCtx, chartData) => {
  const {chartGenres, chartValues} = chartData;
  statisticCtx.height = BAR_HEIGHT * chartValues.length;
  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: chartGenres,
      datasets: [{
        data: chartValues,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticsTemplate = (userData, currentPeriod) => {
  const {movies, hours, chartGenres} = userData;
  const rank = chartGenres[0] + `lover`;
  return (
    `<section class="statistic">
        <p class="statistic__rank">
          Your rank
          <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          <span class="statistic__rank-label">${chartGenres.length === 0 ? `` : rank}</span>
        </p>

        <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
          <p class="statistic__filters-description">Show stats:</p>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${currentPeriod === StatisticPeriod.ALL ? `checked` : ``}>
          <label for="statistic-all-time" class="statistic__filters-label">All time</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${currentPeriod === StatisticPeriod.TODAY ? `checked` : ``}>
          <label for="statistic-today" class="statistic__filters-label">Today</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${currentPeriod === StatisticPeriod.WEEK ? `checked` : ``}>
          <label for="statistic-week" class="statistic__filters-label">Week</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${currentPeriod === StatisticPeriod.MONTH ? `checked` : ``}>
          <label for="statistic-month" class="statistic__filters-label">Month</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${currentPeriod === StatisticPeriod.YEAR ? `checked` : ``}>
          <label for="statistic-year" class="statistic__filters-label">Year</label>
        </form>

        <ul class="statistic__text-list">
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">You watched</h4>
            <p class="statistic__item-text">${movies} <span class="statistic__item-description">movies</span></p>
          </li>
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">Total duration</h4>
            <p class="statistic__item-text">${Math.floor(hours / 60)} <span class="statistic__item-description">h</span>${Math.floor(hours % 60)} <span class="statistic__item-description">m</span></p>
          </li>
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">Top genre</h4>
            <p class="statistic__item-text">${chartGenres.length === 0 ? `` : chartGenres[0]}</p>
          </li>
        </ul>

        <div class="statistic__chart-wrap">
          <canvas class="statistic__chart" width="1000"></canvas>
        </div>

      </section>`
  );
};

export default class Statistics extends SmartView {
  constructor(movies) {
    super();
    this._movies = movies;
    this._currentPeriod = StatisticPeriod.ALL;
    this._handlePeriodChange = this._handlePeriodChange.bind(this);

    this._getStatistics(filter[FilterType.HISTORY](this._movies));
    this._restoreHandlers();
  }

  _setChart() {
    if (this._movies.length === 0) {
      return;
    }

    if (this._barsChart !== null) {
      this._barsChart = null;
    }

    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);
    this._barsChart = renderBarsChart(statisticCtx, this._data);
  }

  _restoreHandlers() {
    this._setChart();
    this.setPeriodChangeHandler();
  }

  _filterDates(days, inputMovie) {
    const date = new Date();
    const dateTo = new Date();
    const dateFrom = new Date(date.setDate(date.getDate() - days));
    dateFrom.setHours(0, 0, 0, 999);
    if (inputMovie.userDetails.watchingDate > dateFrom && inputMovie.userDetails.watchingDate < dateTo) {
      return true;
    }
    return false;
  }

  _handlePeriodChange(evt) {
    evt.preventDefault();
    const watchedMovies = filter[FilterType.HISTORY](this._movies);
    let filteredMovies = watchedMovies.slice();
    this._currentPeriod = evt.target.value;
    switch (evt.target.value) {
      case StatisticPeriod.TODAY:
        filteredMovies = watchedMovies.filter((movie) => this._filterDates(1, movie));
        break;
      case StatisticPeriod.WEEK:
        filteredMovies = watchedMovies.filter((movie) => this._filterDates(7, movie));
        break;
      case StatisticPeriod.MONTH:
        filteredMovies = watchedMovies.filter((movie) => this._filterDates(31, movie));
        break;
      case StatisticPeriod.YEAR:
        filteredMovies = watchedMovies.filter((movie) => this._filterDates(365, movie));
        break;
    }
    this._getStatistics(filteredMovies);
  }

  _getStatistics(movies) {

    const genresType = new Set();
    movies.forEach((movie) => {
      movie.filmInfo.genre.forEach((item) => genresType.add(item));
    });
    const genres = new Map();
    genresType.forEach((type) => {
      const eachGenre = movies.filter((movie) => {
        return movie.filmInfo.genre.some((item) => item === type);
      });
      genres.set(type, eachGenre.length);
    });
    const sortedGenres = new Map([...genres].sort((a, b) => b[1] - a[1]));

    this._data = {
      movies: movies.length,
      hours: movies.reduce((accumulator, movie) => accumulator + movie.filmInfo.runTime, 0),
      chartGenres: Array.from(sortedGenres.keys()),
      chartValues: Array.from(sortedGenres.values())
    };
    this.updateElement();
    this._restoreHandlers();
  }

  setPeriodChangeHandler() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, this._handlePeriodChange);
  }

  getTemplate() {
    return createStatisticsTemplate(this._data, this._currentPeriod);
  }
}
