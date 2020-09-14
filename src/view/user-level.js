import {getUserStatus} from "../utils/movie.js";
import Smart from "./smart.js";

const createUserLevelTemplate = (userInfo) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${getUserStatus(userInfo)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class User extends Smart {
  constructor(userInfo) {
    super();
    this._userInfo = userInfo;
  }

  updateValue(watchedMovies) {
    this._userInfo = watchedMovies;
  }

  getTemplate() {
    return createUserLevelTemplate(this._userInfo);
  }
}
