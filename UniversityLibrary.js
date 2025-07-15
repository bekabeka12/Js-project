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

    //check if book is available
    if(availableBook.isAvailable()){
      //creating new updated list of books
      const newBooks = this.books.map(book => {
        if (book.getId() === bookId) {
          //mark book as unavailable add one to borrowcount
          return {...book, available: false, borrowCount: book.getBorrowCount() > 0 ? book.getBorrowCount() + 1: 1}
        }
        return book;
      });

      let newStudents;
      let message;

      if(matchedStudent){
        //creating new updated list of users by setting borrow date
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

        //creating new user if it doesnot exists in the list
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
    //checking if the book is available or not, if not availavle we cant remove it right now
    let removableBooks = this.books.filter(book => book.isAvailable())
    let exactBook = removableBooks.filter((item) => item.getId() === bookId);

    if (exactBook.length > 0) {
        //removeing book from the list when it is not borrowed
      const updatedBookList = this.books.filter(book => book.getId() !== bookId);
      
      this.updateUniversityLibraryBooksData(updatedBookList);
      return "Book removed!";
    } else {
      return "Please Enter Correct Book Id";
    }
  }

  //returning the top N book with high ratings
  getTopRatedBooks(limit) {
    return [...this.books]
      .sort((element1, element2) => element2.getRating() - element1.getRating())
      .slice(0, limit);
  }

  //returning top N most borrowed books
  getMostPopularBooks(limit) {
    return [...this.books]
      .sort((element1, element2) => element2.borrowCount() - element1.borrowCount())
      .slice(0, limit);
  }

  searchBooksBy(bookProperty, bookValue) {
    //checking if the property exists or not
    const hasProperty = this.books.some((book) => book.hasProperty(bookProperty));

    if (!hasProperty) {
      return "Property does not exists, please enter correct one";
    }
    
    //returnin the values with matched by parameters and values
    return this.books.filter((book) => book.getValueByProperty(bookProperty) === bookValue);
  }

  checkOverdueUsers() {
    const currentDate = new Date();
    let newStudentList = [];

    //first filter the dates which have gap more than 14 days
    let overdueStudents = this.students.filter((student) =>
      student.getBorrowedBooks().some(
        (book) =>
          borrowedDaysCalculator(currentDate, new Date(book.getBorrowDate())) > 14
      )
    );

    overdueStudents.forEach((student) => {
      let username = student.getUsername();
      student.getBorrowedBooks().forEach((book) => {
        //here im checking i user have already returned the bok or not
        if (!book.isReturned()) {
          //if there is overdue setting the penaltypoins
          if (borrowedDaysCalculator(currentDate, new Date(book.getBorrowDate())) > 14) {
            //creating new overdue students with name, amount of days overdued and title of the book
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

  returnBook(username, bookId) {
    let studentMatched = this.students.find((student) => student.getUsername() === username);
    let returnedBook = studentMatched.getBorrowedBooks().find((book) => book.getBookId() === bookId);

    if (returnedBook) {
      //checking if book is already returned
      if (returnedBook.isReturned()) {
        return "This book is already returned";
      } else {
        let afterDueDateDaysCount = (borrowedDaysCalculator(new Date(), new Date(returnedBook.borrowDate)) - 14);

        //creating new list for the users borrowed books where returtned is set to true
        let updatedStudent = {
          ...studentMatched,
          penaltyPoints: studentMatched.penaltyPoints + (afterDueDateDaysCount > 0 ? calculatePenaltyPoints(afterDueDateDaysCount) : 0),
          borrowedBooks: studentMatched.getBorrowedBooks().map(book => 
            book.getBookId() === bookId 
              ? {...book, returned: true}
              : book
          )
        };

        //make the book available by returning new list
        let updatedBooks = this.books.map((book) => book.getId() === bookId ? {...book, available: true} : book)

        //creating new list of students where student with matched username is replaced with updatedStuden
        let newStudents = this.students.map((student) => student.getUsername() === username ? updatedStudent: student)

        this.updateUniversityLibraryStudentsData(newStudents);
        this.updateUniversityLibraryBooksData(updatedBooks);

        return "book is returned";
      }
    }

    return "Please Enter correct username and book id";
  }

  printUserSummary(username){
    //finding matched user in the list
    let studentMatch = this.students.find((student) => student.getUsername() === username);

    let borrowedBooksString = "Borrowed Books:\n";
    //initialized counter for listing
    let counter = 1;

    //finding the book names by using the ids from the students borrowedbooks list
    studentMatch.getBorrowedBooks().forEach((student) => {
      borrowedBooksString += `   ${counter}: ${this.books.find((book) => 
        student.getBookId() === book.getId()).getTitle()}\n`
      counter++;
    })

    let overdueItemsString = "\nOverdue Items: \n";

    //checking if tehre is a name in overdued users list, and if tehre is name getting the titles of the book
    counter = 1;
    this.checkOverdueUsers().forEach((student) => {
      if(username === student.name) {
        overdueItemsString += `   ${counter}: ${student.title}\n`
      }
    })

    //total penaltypoints
    let totalPenaltyScoreString = "\nTotal Penalty Score: " + studentMatch.penaltyPoints

    return borrowedBooksString + overdueItemsString + totalPenaltyScoreString;
  }

  recomendBooks(username){
    let studentMatch = this.students.find((student) => student.getUsername() === username);
    //initializing genrlist for finding out users most prefered book genres
    let genreList = [];

    //initialized bookids to remove from the head of the list
    let bookIds = []

    studentMatch.getBorrowedBooks().forEach((student) => {
      genreList.push(this.books.find((book) => 
      book.getId() === student.getBookId()).getGenre())
      bookIds.push(student.getBookId())
    })

    let sortedBooks = [];

    genreList.forEach((genre) => {
      //im filtering book by availability not to recomend already borrowed books 
      sortedBooks = this.books.filter((book) => book.isAvailable())
        .sort((book1, book2) => {
          //checking if id is in the list of of bookids which are already borrowed, then those books goes below
          if(bookIds.includes(book1.getId()) || bookIds.includes(book2.getId())){
            return 1;
          }

          //if book1 genre equals genree from the list, book1 has higher priority book2
          if (book1.getGenre() === genre && book2.getGenre() !== genre){
            return -1;
          }

          //if book2 genree qeuals genree from the list, book2 has higher priority 
          if(book1.getGenre() !== genre && book2.getGenre() === genre){
            return 1;
          }
          //sorting by rating if both book genree is the same as in genree list
          if (book1.getGenre() === genre && book2.getGenre() === genre) {
            return book2.getRating() - book1.getRating();
          }
        })
    })

    return sortedBooks;
  }
}