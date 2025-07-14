import { BorrowedBook } from "./borrowedBooks.js";
import { formatDateLocale } from "./helpers.js";

export class Student {
  #username;
  #studentId;
  #borrowedBooks;
  #penaltyPoints;

  constructor(username, studentId, borrowedBooks = [], penaltyPoints) {
    this.#username = username;
    this.#studentId = studentId;
    this.#borrowedBooks = borrowedBooks.map(book =>
      book instanceof BorrowedBook
        ? book
        : new BorrowedBook(book.id, book.bookId, book.borrowDate, book.returned)
    );
    this.#penaltyPoints = penaltyPoints;
  }

  getUsername() {
    return this.#username;
  }

  getStudentId() {
    return this.#studentId;
  }

  getBorrowedBooks() {
    return this.#borrowedBooks.map(book => 
      new BorrowedBook(book.getId(), book.getBookId(), book.getBorrowDate(), book.isReturned())
    );
  }

  getPenaltyPoints() {
    return this.#penaltyPoints;
  }

  setUsername(newUsername) {
    if (newUsername && newUsername.trim() !== '') {
      this.#username = newUsername;
    }
  }

  addBorrowedBook(bookId) {
    const newBook = {
      id: this.#borrowedBooks.length + 1,
      bookId: bookId,
      borrowDate: formatDateLocale(new Date()),
    };

    this.#borrowedBooks.push(newBook);
  }

  addPenaltyPoints(points) {
    if (points > 0) {
      this.#penaltyPoints += points;
    }
  }

  clearPenaltyPoints() {
    this.#penaltyPoints = 0;
  }

  toJSON() {
    return {
      username: this.#username,
      studentId: this.#studentId,
      borrowedBooks: this.#borrowedBooks.map(book => book.toJSON()),
      penaltyPoints: this.#penaltyPoints,
    };
  }
}
