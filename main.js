import { Book } from './book.js';
import { Student } from './student.js'
import fs from 'fs';
import { UniversityLibrary } from './UniversityLibrary.js';

const bookData = fs.readFileSync('mocks/bookList.json', 'utf8');
const bookJsonData = JSON.parse(bookData);
const studentData = fs.readFileSync('mocks/studentsList.json', 'utf8');
const studentJsonData = JSON.parse(studentData);

const books = bookJsonData.map(book => new Book(
    book.id,
    book.title,
    book.author, 
    book.genre, 
    book.rating, 
    book.year, 
    book.borrowCount, 
    book.available
));

const students = studentJsonData.map((student) => new Student(
    student.username,
    student.studentId,
    student.borrowedBooks, 
    student.penaltyPoints 
));

const student =   {
    "author": "J.R.R. Tolkien",
    "genre": "Horror",
    "year": 1957
  };

const LibraryData = new UniversityLibrary(books, students)

// console.log(LibraryData.getTopRatedBooks(10))
// console.log(LibraryData.searchBooksBy("available", false))
// console.log(LibraryData.addBook(student))
// console.log(LibraryData.removeBook(100))
// console.log(LibraryData.checkOverdueUsers())
// console.log(LibraryData.returnedBook("alice", 82))
// console.log(LibraryData.borrowBook("beka", 8))
// console.log(LibraryData.printUserSummary("nancy"))
// console.log(LibraryData.recomenBooks("alice"))