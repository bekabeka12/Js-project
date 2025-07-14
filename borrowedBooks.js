export class BorrowedBook {
  #id;
  #bookId;
  #borrowDate;
  #returned;

  constructor(id, bookId, borrowDate, returned) {
    this.#id = id;
    this.#bookId = bookId;
    this.#borrowDate = new Date(borrowDate);
    this.#returned = returned;
  }

  getId() {
    return this.#id;
  }

  getBookId() {
    return this.#bookId;
  }

  getBorrowDate() {
    return this.#borrowDate;
  }

  isReturned() {
    return this.#returned;
  }

  withReturnedStatus(newStatus) {
    return new BorrowedBook(this.#id, this.#bookId, this.#borrowDate, newStatus);
  }

  toJSON() {
    return {
      id: this.#id,
      bookId: this.#bookId,
      borrowDate: this.#borrowDate.toISOString().split("T")[0],
      returned: this.#returned,
    };
  }
}
