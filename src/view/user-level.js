import {getUserStatus} from "../util.js";

export const createUserLevelTemplate = (userInfo) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${getUserStatus(userInfo)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};
