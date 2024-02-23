/*
[
    {
        * id: <int> || <string>,
        * title: <string>,
        * author: <string>,
        * year: <int>,
        * description: <string>,
        * isCompleted: <boolean>,
    }
]
*/

const books = [];
const STORAGE_KEY = "BOOK_APPS";
const SAVED_EVENT = "saved-books";
const RENDER_EVENT = "render-books";

const generateUniqueID = () => {
  return +new Date();
};

const newDispatchEvent = (name) => document.dispatchEvent(new Event(name));

const isStorageExist = () => {
  if (typeof Storage === undefined) return false;
  return true;
};

const savedBook = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    newDispatchEvent(SAVED_EVENT);
  }
};

const loadDataBookFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (let bookItem of data) {
      books.push(bookItem);
    }
  }

  newDispatchEvent(RENDER_EVENT);
};

const createBookElement = (book) => {
  const { id, title, author, year, description, isCompleted } = book;

  const textTitle = document.createElement("h3");
  textTitle.classList.add("book-item__title");
  textTitle.textContent = `${title}`;

  const textAuthor = document.createElement("p");
  textAuthor.classList.add("book-item__subtitle--author");
  textAuthor.textContent = `${author}`;

  const textYear = document.createElement("p");
  textYear.classList.add("book-item__subtitle--year");
  textYear.textContent = `${year}`;

  // Container content
  const containerContent = document.createElement("div");
  containerContent.classList.add("book-item__subtitle");
  containerContent.append(textAuthor, textYear);

  const textDescription = document.createElement("p");
  textDescription.classList.add("book-item__description");
  textDescription.textContent = `${description}`;

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("book-item__action");

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("book-item__action--delete");
  deleteBtn.textContent = "Hapus";

  deleteBtn.addEventListener("click", () => removeBook(id));

  if (isCompleted) {
    const unDoneBtn = document.createElement("button");
    unDoneBtn.classList.add("book-item__action--undone");
    unDoneBtn.textContent = "Belum dibaca";

    unDoneBtn.addEventListener("click", () => unDoneReadBook(id));

    actionContainer.append(unDoneBtn);
  } else {
    const doneBtn = document.createElement("button");
    doneBtn.classList.add("book-item__action--done");
    doneBtn.textContent = "Selesai dibaca";

    doneBtn.addEventListener("click", () => doneReadBook(id));

    actionContainer.append(doneBtn);
  }

  actionContainer.append(deleteBtn);

  const container = document.createElement("div");
  container.classList.add("book-item");
  container.append(
    textTitle,
    containerContent,
    textDescription,
    actionContainer
  );
  container.setAttribute("book-id", id);

  return container;
};

const addBook = () => {
  const id = generateUniqueID();
  const title = document.getElementById("form-input-title").value;
  const author = document.getElementById("form-input-author").value;
  const year = document.getElementById("form-input-year").value;
  const description = document.getElementById("form-input-description").value;
  const isCompleted = document.getElementById("form-input-iscompleted").checked;

  const newBook = {
    id: Number(id),
    title,
    author,
    year: Number(year),
    description,
    isCompleted,
  };
  books.push(newBook);

  newDispatchEvent(RENDER_EVENT);
  savedBook();
};

const doneReadBook = (id) => {
  books.map((book) => {
    if (book.id === id) {
      book.isCompleted = !book.isCompleted;
    }
  });

  newDispatchEvent(RENDER_EVENT);
  savedBook();
};

const unDoneReadBook = (id) => {
  books.map((book) => {
    if (book.id === id) {
      book.isCompleted = !book.isCompleted;
      return book;
    }
    return null;
  });

  newDispatchEvent(RENDER_EVENT);
  savedBook();
};

const removeBook = (bookId) => {
  const bookTarget = books.findIndex((book) => book === bookId);

  books.splice(bookTarget, 1);

  newDispatchEvent(RENDER_EVENT);
  savedBook();
};

document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("form-book");

  submitForm.addEventListener("submit", (e) => {
    e.preventDefault();

    addBook();

    submitForm.reset();
  });

  if (isStorageExist()) {
    loadDataBookFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, () => {
  const unCompletedListBook = document.getElementById("books-uncompleted");
  const completedListBook = document.getElementById("books-completed");

  unCompletedListBook.innerHTML = "";
  completedListBook.innerHTML = "";

  books.map((bookItem) => {
    const bookElement = createBookElement(bookItem);

    if (bookItem.isCompleted) {
      completedListBook.append(bookElement);
    } else {
      unCompletedListBook.append(bookElement);
    }
  });
});

/**
 * Footer DOM manipulation
 */
const footer = document.querySelector("footer");
const currentDate = new Date().getFullYear();
footer.innerHTML = `<p>&copy; ${currentDate} All rights reversed.</p>`;
