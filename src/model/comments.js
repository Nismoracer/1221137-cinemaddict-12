import Observer from "../utils/observer.js";
import {UpdateType} from "../const.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(updateType, comments) {
    this._comments = comments.slice();
    this._notify(updateType);
  }

  getComments() {
    return this._comments;
  }

  addComment(update) {
    this._comments = [
      ...this._comments,
      update,
    ];
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
    this._notify(UpdateType.PATCH, update);
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          date: comment.date !== null ? new Date(comment.date) : comment.date
        }
    );
    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          date: comment.date instanceof Date ? comment.date.toISOString() : null
        }
    );
    delete adaptedComment.id;
    delete adaptedComment.author;
    return adaptedComment;
  }
}
