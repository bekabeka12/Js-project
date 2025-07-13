import { Book } from './book.js';
import { Student } from './students.js'
import { UniversityLibrary } from './UniversityLibrary.js'
import fs from 'fs';

const bookData = fs.readFileSync('BookList.json', 'utf8');
const bookJsonData = JSON.parse(bookData);
const studentData = fs.readFileSync('StudentsList.json', 'utf8');
const studentJsonData = JSON.parse(studentData);

const books = bookJsonData.map(book => new Book(
    book.id, 
    book.author, 
    book.genre, 
    book.rating, 
    book.year, 
    book.borrowCount, 
    book.available
));

const students = studentJsonData.map((student) => new Student(
    student.username, 
    student.borrowedBooks, 
    student.penaltyPoints, 
));

const student =   {
    "id": 101,
    "author": "J.R.R. Tolkien",
    "genre": "Horror",
    "rating": 3.7,
    "year": 1957,
    "borrowCount": 17,
    "available": false
  };

const LibraryData = new UniversityLibrary(books, students)

// console.log(LibraryData.getTopRatedBooks(10))
// console.log(LibraryData.searchBooksBy("author", "Stephen King"))
// console.log(LibraryData.addBook(student))
// console.log(LibraryData.removeBook(100))
// console.log(LibraryData.checkOverdueUsers())
// console.log(LibraryData.returnBook("alice", 82))
// console.log(LibraryData.borrowBook("beka", 1))
// console.log(LibraryData.printUserSummary("nancy"))
// console.log(LibraryData.recomenBooks("alice"))