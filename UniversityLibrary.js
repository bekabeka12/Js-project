import { Student } from "./students.js";
import { Book } from "./book.js"

export class UniversityLibrary {
  constructor(books, students) {
    this.books = books;
    this.student = students;
  }

  addBook(book) {
    const exactBook = this.books.filter((item) => item.id === book.id);

    if (exactBook.length <= 0) {
      this.books.push(new Book(
        book.id, 
        book.author, 
        book.genre, 
        book.rating, 
        book.year, 
        book.borrowCount, 
        book.available
      ));
      
      return this.books;
    }

    return "Book with that Id already exists";
  }

  removeBook(bookId) {
    let removableBooks = this.books.filter(book => book.available)
    let exactBook = removableBooks.filter((item) => item.id === bookId);

    if (exactBook.length > 0) {
      const bookIndex = this.books.indexOf(exactBook[0]);
      this.books.splice(bookIndex, 1)
      return this.books;
    } else {
      console.log("Please Enter Correct Book Id");
    }
  }

  getTopRatedBooks(limit) {
    return this.books
      .sort((element1, element2) => element2.rating - element1.rating)
      .slice(0, limit);
  }

  getMostPopularBooks(limit) {
    return this.books
      .sort((element1, element2) => element2.borrowCount - element1.borrowCount)
      .slice(0, limit);
  }

  searchBooksBy(bookProperty, bookValue) {
    return this.books.filter((book) => book[bookProperty] === bookValue);
  }

  checkOverdueUsers() {
    const currentDate = new Date();
    let newStudentList = [];

    let overdueStudents = this.student.filter((student) =>
      student.borrowedBooks.some(
        (book) =>
          borrowedDaysCalculator(currentDate, new Date(book.borrowDate)) > 14
      )
    );

    overdueStudents.forEach((student) => {
      let username = student.username;
      student.borrowedBooks.forEach((book) => {
        if (!book.returned) {
          if (
            borrowedDaysCalculator(currentDate, new Date(book.borrowDate)) > 14
          ) {
            let student = {
              name: username,
              overdue:
                borrowedDaysCalculator(currentDate, new Date(book.borrowDate)) -
                14,
              author: book.author,
            };
            newStudentList.push(student);
          }
        }
      });
    });

    return newStudentList;
  }

  borrowBook(username, bookId) {
    let availableBook = this.books.find((book) => book.id === bookId);
    let matchedStudent = this.student.find((student) => student.username === username);


    if(availableBook.available){
      if(matchedStudent){
        availableBook.available = false;
        let newBookBorrowedBook = {
          id: matchedStudent.borrowedBooks.length + 1,
          bookId: availableBook.id,
          genre: availableBook.genre,
          borrowDate: new Date(),
          author: availableBook.author,
          returned: false
        }

        matchedStudent.borrowedBooks.push(newBookBorrowedBook)
        return this.books
      }else {
        availableBook.available = false;
        let newStudent = {
          username: username,
          borrowedBooks: [{
            id: 1,
            bookId: availableBook.id,
            genre: availableBook.genre,
            borrowDate: new Date(),
            author: availableBook.author,
            returned: false
          }],
          penaltyPoints: 0,
        }

        this.student.push(new Student(
          newStudent.username,
          newStudent.borrowedBooks,
          newStudent.penaltyPoints,
        ));

        return this.student;
      }
    }

    return "Please Enter correct username and book id";
  }

  returnBook(username, bookId) {
    let usernameMatch = this.student.find((student) => student.username === username);
    let returnedBook = usernameMatch.borrowedBooks.find((book) => book.bookId === bookId);

    if (returnedBook) {
      if (returnedBook.returned) {
        return "This book is already returned";
      } else {
        let afterDueDateDaysCount = (borrowedDaysCalculator(new Date(), new Date(returnedBook.borrowDate)) - 14);

        if(afterDueDateDaysCount > 0){
          usernameMatch.penaltyPoints += calculatePenaltyPoints(afterDueDateDaysCount);
        }

        this.books.find((book) => book.id === bookId).available = true;
        return this.books;
      }
    }

    return "Please Enter correct username and book id";
  }

  printUserSummary(username){
    let studentMatch = this.student.find((student) => student.username === username);

    let borrowedBooksString = "Borrowed Books:\n";
    let counter = 1;
    studentMatch.borrowedBooks.forEach((student) => {
      borrowedBooksString += `   ${counter}: ${student.author}\n`
      counter++;
    })

    let overdueItemsString = "\nOverdue Items: \n";

    counter = 1;
    this.checkOverdueUsers().forEach((student) => {
      if(username === student.name) {
        overdueItemsString += `   ${counter}: ${student.author}\n`
      }
    })

    let totalPenaltyScoreString = "\nTotal Penalty Score: " + studentMatch.penaltyPoints

    return borrowedBooksString + overdueItemsString + totalPenaltyScoreString;
  }

  recomenBooks(username){
    let studentMatch = this.student.find((student) => student.username === username);
    let genreList = [];
    let bookIds = []

    studentMatch.borrowedBooks.forEach((student) => {
      genreList.push(student.genre)
      bookIds.push(student.bookId)
    })

    let sortedBooks = [];

    genreList.forEach((genre) => {
      sortedBooks = this.books.filter((book) => book.available)
        .sort((book1, book2) => {
          if(bookIds.includes(book1.id) || bookIds.includes(book2.id)){
            return 1;
          }
          if (book1.genre === genre && book2.genre !== genre){
            return -1;
          }
          if(book1.genre !== genre && book2.genre === genre){
            return 1;
          }
          if (book1.genre === genre && book2.genre === genre) {
            return book1.rating - book2.rating;
          }
        })
    })

    return sortedBooks;
  }
}

function borrowedDaysCalculator(date1, date2) {
  return Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));
}

function calculatePenaltyPoints(daysOverdue) {
  if (daysOverdue <= 10) {
    return (daysOverdue * (daysOverdue + 1)) / 2 * 0.1;
  }

  return 5.5;
}

