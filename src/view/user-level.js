import {getUserStatus, createElement} from "../util.js";

const createUserLevelTemplate = (userInfo) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${getUserStatus(userInfo)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class User {
  constructor(userInfo) {
    this._element = null;
    this._userInfo = userInfo;
  }

  getTemplate() {
    return createUserLevelTemplate(this._userInfo);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
