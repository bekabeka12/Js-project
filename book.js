export class Book {
  #id;
  #title;
  #author;
  #genre;
  #rating;
  #year;
  #borrowCount;
  #available;

  constructor(id, title, author, genre, rating, year, borrowCount, available) {
    this.#id = id;
    this.#title = title;
    this.#author = author;
    this.#genre = genre;
    this.#rating = rating;
    this.#year = year;
    this.#borrowCount = borrowCount;
    this.#available = available;
  }

  getId() {
    return this.#id;
  }

  getTitle() {
    return this.#title;
  }

  getAuthor() {
    return this.#author;
  }

  getGenre() {
    return this.#genre;
  }

  getRating() {
    return this.#rating;
  }

  getYear() {
    return this.#year;
  }

  getBorrowCount() {
    return this.#borrowCount;
  }

  isAvailable() {
    return this.#available;
  }

  setTitle(newTitle) {
    this.#title = newTitle;
  }

  setAuthor(newAuthor) {
    this.#author = newAuthor;
  }

  setGenre(newGenre) {
    this.#genre = newGenre;
  }

  setRating(newRating) {
    this.#rating = newRating;
  }

  setYear(newYear) {
    this.#year = newYear;
  }

  setAvailable(status) {
    this.#available = status;
  }

  incrementBorrowCount() {
    this.#borrowCount += 1;
  }

  resetBorrowCount() {
    this.#borrowCount = 0;
  }

  hasProperty(propertyName) {
    return [
      'id', 
      'title',
      'author',
      'genre',
      'rating',
      'year',
      'borrowCount',
      'available'
    ].includes(propertyName);
  }

  getValueByProperty(propertyName) {
    switch(propertyName) {
      case 'id':
        return this.#id;
      case 'title':
        return this.#title;
      case 'author':
        return this.#author;
      case 'genre':
        return this.#genre;
      case 'rating':
        return this.#rating;
      case 'year':
        return this.#year;
      case 'borrowCount':
        return this.#borrowCount;
      case 'available':
        return this.#available;
      default:
        return undefined;
    }
  }

    toJSON() {
    return {
        id: this.#id,
        title: this.#title,
        author: this.#author,
        genre: this.#genre,
        rating: this.#rating,
        year: this.#year,
        borrowCount: this.#borrowCount,
        available: this.#available,
    }
    }
}
