import {getUserStatus} from "../utils/movie.js";
import AbstractView from "./abstract.js";

const createUserLevelTemplate = (userInfo) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${getUserStatus(userInfo)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class User extends AbstractView {
  constructor(userInfo) {
    super();
    this._userInfo = userInfo;
  }

  getTemplate() {
    return createUserLevelTemplate(this._userInfo);
  }
}
