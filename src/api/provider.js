import MoviesModel from "../model/movies.js";
import CommentsModel from "../model/comments.js";

const getSyncedMovies = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.movie);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  requestComments(movieId) {
    if (Provider.isOnline()) {
      return this._api.requestComments(movieId)
        .then((comments) => {
          const items = comments.map(CommentsModel.adaptToClient);
          this._store.setItem(movieId, items);
          return comments;
        });
    }

    const storeComments = Object.values(this._store.getItems());
    return Promise.resolve(storeComments[movieId]);
  }

  getMovies() {
    if (Provider.isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          const items = createStoreStructure(movies.map(MoviesModel.adaptToServer));
          this._store.setItems(items);
          return movies;
        });
    }

    const storeMovies = Object.values(this._store.getItems());

    return Promise.resolve(storeMovies.map(MoviesModel.adaptToClient));
  }

  updateMovie(movie) {
    if (Provider.isOnline()) {
      return this._api.updateMovie(movie)
        .then((updatedMovie) => {
          this._store.setItem(updatedMovie.id, MoviesModel.adaptToServer(updatedMovie));
          return updatedMovie;
        });
    }

    this._store.setItem(movie.id, MoviesModel.adaptToServer(Object.assign({}, movie)));

    return Promise.resolve(movie);
  }

  sync() {
    if (Provider.isOnline()) {
      const storeMovies = Object.values(this._store.getItems());

      return this._api.sync(storeMovies)
        .then((response) => {
          const updatedMovies = getSyncedMovies(response.updated);

          const items = createStoreStructure([...updatedMovies]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
