import { Student } from "./student.js";
import { Book } from "./book.js"
import { calculatePenaltyPoints, borrowedDaysCalculator, rateGenerator, formatDateLocale } from "./helpers.js";
import { BorrowedBook } from "./borrowedBooks.js";

export class UniversityLibrary {
  constructor(books, students) {
    this.books = books;
    this.students = students;
  }

  updateUniversityLibraryBooksData(books){
    this.books = books
  }

  updateUniversityLibraryStudentsData(students){
    this.students = students
  }

  borrowBook(username, bookId) {
    let availableBook = this.books.find((book) => book.getId() === bookId);
    let matchedStudent = this.students.find((student) => student.getUsername() === username);


    if(availableBook.isAvailable()){
      //creating new updated list of books
      const newBooks = this.books.map(book => {
        if (book.getId() === bookId) {
          return {...book, available: false}
        }
        return book;
      });

      let newStudents;
      let message;

      if(matchedStudent){
        //creating new updated list of users
        newStudents = this.students.map((student) => {
          if(student.getUsername() === username) {
            const newBook = new BorrowedBook(
              student.getBorrowedBooks().length + 1,
              availableBook.getId(),
              formatDateLocale(new Date()),
              false
            );

            return new Student(
                student.getUsername(),
                student.getStudentId(),
                [...student.getBorrowedBooks(), newBook],
                student.getPenaltyPoints()
            );            
          }
          return student;
        })
        message = "Book successfully borrowed"
      } else {
        //copping existing students list
        newStudents = [...this.students];

        //creating new student ovject
        // let newStudent = {
        //   username: username,
        //   studentId: this.students[this.students.length - 1].getStudentId() + 1,
        //   borrowedBooks: [{
        //     id: 1,
        //     bookId: availableBook.getId(),
        //     borrowDate: new Date(),
        //     returned: false
        //   }],
        //   penaltyPoints: 0,
        // }

        let newStudent = new Student(
          username,
          this.students[this.students.length - 1].getStudentId() + 1,
          [new BorrowedBook(
            1,
            availableBook.getId(),
            new Date(),
            false
          )],
          0
        )

        //pushing created student object to copied studet list
        newStudents.push(new Student(
          newStudent.username,
          newStudent.studentId,
          newStudent.borrowedBooks,
          newStudent.penaltyPoints,
        ));

        message = "New user added!"
      }

      //updating lists
      this.updateUniversityLibraryBooksData(newBooks)
      this.updateUniversityLibraryStudentsData(newStudents)

      return { 
        books: newBooks,
        students: newStudents, 
        message: message
      };
    }

    return "Please Enter correct username and book id";
  }

  addBook(book) {
    const exactBook = this.books.filter((item) => item.getId() === book.id);

    if (exactBook.length <= 0) {
      const newBookId = this.books[this.books.length - 1].id + 1;

      const newBook = new Book(
        newBookId, 
        book.author, 
        book.genre, 
        rateGenerator(), 
        book.year, 
        0, 
        true
      );

      const updatedBooks = [...this.books, newBook];
      this.updateUniversityLibraryBooksData(updatedBooks);
    
      return "Book added successfully";
    }

    return "Missing book property";
  }

  removeBook(bookId) {
    let removableBooks = this.books.filter(book => book.isAvailable())
    let exactBook = removableBooks.filter((item) => item.getId() === bookId);

    if (exactBook.length > 0) {
      const updatedBookList = this.books.filter(book => book.getId() !== bookId);
      
      this.updateUniversityLibraryBooksData(updatedBookList);
      return "Book removed!";
    } else {
      return "Please Enter Correct Book Id";
    }
  }

  getTopRatedBooks(limit) {
    return [...this.books]
      .sort((element1, element2) => element2.getRating() - element1.getRating())
      .slice(0, limit);
  }

  getMostPopularBooks(limit) {
    return [...this.books]
      .sort((element1, element2) => element2.borrowCount() - element1.borrowCount())
      .slice(0, limit);
  }

  searchBooksBy(bookProperty, bookValue) {
    const hasProperty = this.books.some((book) => book.hasProperty(bookProperty));

    if (!hasProperty) {
      return "Property does not exists, please enter correct one";
    }
    
    return this.books.filter((book) => book.getValueByProperty(bookProperty) === bookValue);
  }

  checkOverdueUsers() {
    const currentDate = new Date();
    let newStudentList = [];

    let overdueStudents = this.students.filter((student) =>
      student.getBorrowedBooks().some(
        (book) =>
          borrowedDaysCalculator(currentDate, new Date(book.getBorrowDate())) > 14
      )
    );

    overdueStudents.forEach((student) => {
      let username = student.getUsername();
      student.getBorrowedBooks().forEach((book) => {
        if (!book.isReturned()) {
          if (
            borrowedDaysCalculator(currentDate, new Date(book.getBorrowDate())) > 14
          ) {
            let student = {
              name: username,
              overdue:
                borrowedDaysCalculator(currentDate, new Date(book.getBorrowDate())) -
                14,
              title: this.books.find((element) => element.getId() === book.getBookId()).getTitle(),
            };
            newStudentList.push(student);
          }
        }
      });
    });

    return newStudentList;
  }

  returnedBook(username, bookId) {
    let studentMatched = this.students.find((student) => student.getUsername() === username);
    let returnedBook = studentMatched.getBorrowedBooks().find((book) => book.getBookId() === bookId);

    if (returnedBook) {
      if (returnedBook.isReturned()) {
        return "This book is already returned";
      } else {
        let afterDueDateDaysCount = (borrowedDaysCalculator(new Date(), new Date(returnedBook.borrowDate)) - 14);

        let updatedStudent = {
          ...studentMatched,
          penaltyPoints: studentMatched.penaltyPoints + (afterDueDateDaysCount > 0 ? calculatePenaltyPoints(afterDueDateDaysCount) : 0),
          borrowedBooks: studentMatched.getBorrowedBooks().map(book => 
            book.getBookId() === bookId 
              ? {...book, returned: true}
              : book
          )
        };

        let updatedBooks = this.books.map((book) => book.getId() === bookId ? {...book, available: true} : book)
        let newStudents = this.students.map((student) => student.getUsername() === username ? updatedStudent: student)

        this.updateUniversityLibraryStudentsData(newStudents);
        this.updateUniversityLibraryBooksData(updatedBooks);

        return "book is returned";
      }
    }

    return "Please Enter correct username and book id";
  }

  printUserSummary(username){
    let studentMatch = this.students.find((student) => student.getUsername() === username);

    let borrowedBooksString = "Borrowed Books:\n";
    let counter = 1;
    studentMatch.getBorrowedBooks().forEach((student) => {
      borrowedBooksString += `   ${counter}: ${this.books.find((book) => 
        student.getBookId() === book.getId()).getTitle()}\n`
      counter++;
    })

    let overdueItemsString = "\nOverdue Items: \n";

    counter = 1;
    this.checkOverdueUsers().forEach((student) => {
      if(username === student.name) {
        overdueItemsString += `   ${counter}: ${student.title}\n`
      }
    })

    let totalPenaltyScoreString = "\nTotal Penalty Score: " + studentMatch.penaltyPoints

    return borrowedBooksString + overdueItemsString + totalPenaltyScoreString;
  }

  recomenBooks(username){
    let studentMatch = this.students.find((student) => student.getUsername() === username);
    let genreList = [];
    let bookIds = []

    studentMatch.getBorrowedBooks().forEach((student) => {
      genreList.push(this.books.find((book) => 
      book.getId() === student.getBookId()).getGenre())
      bookIds.push(student.getBookId())
    })

    let sortedBooks = [];

    genreList.forEach((genre) => {
      sortedBooks = this.books.filter((book) => book.isAvailable())
        .sort((book1, book2) => {
          if(bookIds.includes(book1.getId()) || bookIds.includes(book2.getId())){
            return 1;
          }
          if (book1.getGenre() === genre && book2.getGenre() !== genre){
            return -1;
          }
          if(book1.getGenre() !== genre && book2.getGenre() === genre){
            return 1;
          }
          if (book1.getGenre() === genre && book2.getGenre() === genre) {
            return book1.getRating() - book2.getRating();
          }
        })
    })

    return sortedBooks;
  }
}