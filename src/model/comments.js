import Observer from "../utils/observer.js";
import {UserAction} from "../const.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  addComment(update) {
    this._comments = [
      ...this._comments,
      update,
    ];

    this._notify(UserAction.ADD_ELEMENT, update);
  }

  deleteComment(update) {
    const index = this._comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting task`);
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1)
    ];
    this._notify(UserAction.DELETE_ELEMENT, update);
  }
}
