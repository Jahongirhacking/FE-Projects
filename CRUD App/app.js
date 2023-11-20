// ELEMENTS
const addTodo = document.getElementById("add-todo");
const addBtn = document.getElementById("add-btn");
const clearBtn = document.getElementById("clear-btn");
const todos = document.getElementById("todos");
const invalidInput = document.getElementById("invalid-input");
const fullDay = document.getElementById("full-day");
const clockTime = document.getElementById("time");
const modalContainer = document.getElementById("modal-container");
const modalTitle = document.getElementById("modal-title");
const modalInfo = document.getElementById("modal-info");
const modalButtons = document.getElementById("modal-btns");
// STATE OF TODOS
let todosList = new Array();

const appendChildToParent = (child, parent) => {
  parent.appendChild(child);
};

const binarySearch = (id) => {
  const lengthOfList = todosList.length;
  let l = 0;
  let r = lengthOfList - 1;
  let m = -1;
  while (l <= r) {
    m = Math.floor((l + r) / 2);
    if (todosList[m].now.id == id) {
      return m;
    } else if (
      Number.parseInt(todosList[m].now.id.slice(5)) >
      Number.parseInt(id.slice(5))
    ) {
      r = m - 1;
    } else {
      l = m + 1;
    }
  }
  return -1;
};

const getCurrentDate = () => {
  const now = new Date();
  const d = now.getDate();
  const m = now.getMonth();
  const y = now.getFullYear();
  const hh = now.getHours();
  const mm = now.getMinutes();
  const ss = now.getSeconds();
  const day = d < 10 ? "0" + d : "" + d;
  const month = m + 1 < 10 ? "0" + (m + 1) : "" + (m + 1);
  const year = y < 10 ? "0" + y : "" + y;
  const hours = hh < 10 ? "0" + hh : "" + hh;
  const minutes = mm < 10 ? "0" + mm : "" + mm;
  const seconds = ss < 10 ? "0" + ss : "" + ss;
  return {
    day,
    month,
    year,
    hours,
    minutes,
    seconds,
    id: `todo-${now.valueOf()}`,
  };
};

const showTime = () => {
  const months = [
    "Jan",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = getCurrentDate();
  // DAY MONTH, YEAR
  fullDay.textContent = `${date.day} ${
    months[Number.parseInt(date.month) - 1]
  }, ${date.year}`;
  // HOURS : MINUTES : SECONDS
  clockTime.textContent = `${date.hours} : ${date.minutes} : ${date.seconds}`;
};

//  STORAGE WORK
const updateLocalStorage = () => {
  localStorage.setItem("todosList", JSON.stringify(todosList));
};

const getLocalStorage = () => {
  return JSON.parse(localStorage.getItem("todosList"));
};

const clearLocalStorage = () => {
  localStorage.clear();
};

// TODO LIST
const appendTodoList = (todoString, now) => {
  todosList.push({ todoString, now, isDone: false });
  updateLocalStorage();
};

const clearTodoList = () => {
  todosList.length = 0;
};

// INPUT
const clearInput = () => {
  addTodo.value = "";
};

const showInvalidInput = () => {
  if (invalidInput.classList.contains("hidden")) {
    invalidInput.classList.remove("hidden");
    const timeOut = setTimeout(
      () => invalidInput.classList.add("hidden"),
      3000
    );
  }
};

const checkInputValidity = () => {
  const restrictedWords = ["fuck", "pussy", "penis", "nigga", "ass"];
  let todoString = addTodo.value.trim();
  let isRestricted = false;
  for (const word of restrictedWords) {
    if (todoString.includes(word)) {
      isRestricted = true;
      break;
    }
  }
  if (todoString.length === 0 || todoString === " " || isRestricted) {
    showInvalidInput();
    return false;
  }
  return true;
};

// BUTTONS FUNCTION

const openModal = () => {
  modalContainer.classList.remove("hidden");
};

const closeModal = (e) => {
  modalContainer.classList.add("hidden");
  modalTitle.textContent = "";
  modalInfo.innerHTML = "";
  modalButtons.innerHTML = "";
};

const clearEverythingFn = () => {
  clearInput();
  clearLocalStorage();
  clearTodoList();
  main();
};

const clearEverythingModal = () => {
  modalTitle.textContent = "Alert!";
  modalInfo.innerHTML = `Are you sure to delete all, including:
                              <ul>
                                  <li>Input</li>
                                  <li>Local Storage</li>
                                  <li>List of Todos</li>
                              </ul>`;
  // NO Button
  const noBtn = document.createElement("button");
  noBtn.setAttribute("class", "btn primary-btn");
  noBtn.textContent = "No";
  noBtn.addEventListener("click", closeModal);
  // YES Button
  const yesBtn = document.createElement("button");
  yesBtn.setAttribute("class", "btn danger-btn");
  yesBtn.textContent = "Yes";
  yesBtn.addEventListener("click", clearEverythingFn);
  // Buttons
  modalButtons.appendChild(noBtn);
  modalButtons.appendChild(yesBtn);
  openModal();
};

const makeDoneTodo = (todo) => {
  todo.classList.toggle("done");
  const index = binarySearch(todo.getAttribute("id"));
  if (index !== -1) {
    todosList[index].isDone = todo.classList.contains("done");
    updateLocalStorage();
  }
};

const zoomTodoFn = (e) => {
  e.stopPropagation();
  modalTitle.textContent = "Read the whole text";
  modalInfo.textContent = e.target.parentElement.children[0].textContent;
  openModal();
};

const editTodoFn = (value, todo) => {
  const now = getCurrentDate();
  const id = todo.getAttribute("id");
  const obj = {
    todoString: value,
    now,
  };
  obj.now.id = id;
  // Editing from Array
  todo.children[0].textContent = value;
  // TIME
  todo.children[1].textContent = `${now.hours}:${now.minutes} ${now.day}.${now.month}.${now.year}`;

  let index = binarySearch(id);
  if (index !== -1) {
    todosList.splice(index, 1, obj);
    updateLocalStorage();
  }
  closeModal();
};

const editTodoModal = (e) => {
  e.stopPropagation();
  modalTitle.textContent = "Edit the task";
  // Input
  const modalInput = document.createElement("input");
  modalInput.setAttribute("placeholder", "write new todo...");
  modalInput.setAttribute("class", "input-txt");
  modalInput.setAttribute("type", "text");
  modalInput.value = e.target.parentElement.children[0].textContent;
  modalInfo.innerHTML = "";
  // Button
  const modalButton = document.createElement("button");
  modalButton.setAttribute("class", "btn");
  modalButton.textContent = "Edit";
  modalButton.addEventListener("click", () =>
    editTodoFn(modalInput.value, e.target.parentElement)
  );
  appendChildToParent(modalInput, modalInfo);
  appendChildToParent(modalButton, modalButtons);
  openModal();
};

const deleteTodoFn = (todo) => {
  const id = todo.getAttribute("id");
  const index = binarySearch(id);
  if (index !== -1) {
    todo.remove();
    todosList.splice(index, 1);
    updateLocalStorage();
  }
  closeModal();
};

const deleteTodoModal = (e) => {
  e.stopPropagation();
  modalTitle.textContent = "Alert!";
  modalInfo.textContent = "Are you sure to delete the task?";
  // NO Button
  const noBtn = document.createElement("button");
  noBtn.setAttribute("class", "btn primary-btn");
  noBtn.textContent = "No";
  noBtn.addEventListener("click", closeModal);
  // YES Button
  const yesBtn = document.createElement("button");
  yesBtn.setAttribute("class", "btn danger-btn");
  yesBtn.textContent = "Yes";
  yesBtn.addEventListener("click", () => deleteTodoFn(e.target.parentElement));
  // Buttons
  modalButtons.appendChild(noBtn);
  modalButtons.appendChild(yesBtn);
  openModal();
};

const addTodoFn = (isFromInput = true, index = -1) => {
  let now, todoString, isDone;
  if (isFromInput) {
    now = getCurrentDate();
    todoString = addTodo.value;
    isDone = false;
  } else {
    now = todosList[index].now;
    todoString = todosList[index].todoString;
    isDone = todosList[index].isDone;
  }
  if (!isFromInput || checkInputValidity()) {
    const list = document.createElement("li");
    list.setAttribute("class", "list");
    if (isDone) list.classList.add("done");
    list.setAttribute("id", now.id);
    list.addEventListener("click", () => makeDoneTodo(list));
    // TITLE
    const title = document.createElement("span");
    title.setAttribute("class", "title");
    title.textContent = todoString;
    // TIME
    const postedTime = document.createElement("span");
    postedTime.setAttribute("class", "time");
    postedTime.textContent = `${now.hours}:${now.minutes} ${now.day}.${now.month}.${now.year}`;
    // ZOOM
    const zoomTodo = document.createElement("span");
    zoomTodo.setAttribute("class", "zoom icon bi bi-eye-fill");
    zoomTodo.addEventListener("click", zoomTodoFn);
    // EDIT
    const editTodo = document.createElement("span");
    editTodo.setAttribute("class", "edit icon bi bi-pencil-fill");
    editTodo.addEventListener("click", editTodoModal);
    // DELETE
    const deleteTodo = document.createElement("span");
    deleteTodo.setAttribute("class", "delete icon bi bi-trash-fill");
    deleteTodo.addEventListener("click", deleteTodoModal);

    // POSTING TODO
    isFromInput && appendTodoList(todoString, now);
    appendChildToParent(title, list);
    appendChildToParent(postedTime, list);
    appendChildToParent(zoomTodo, list);
    appendChildToParent(editTodo, list);
    appendChildToParent(deleteTodo, list);
    appendChildToParent(list, todos);
  }
  addTodo.value = "";
};

const keyboardControl = (e) => {
  if (e.key === "Enter" && e.target === addTodo) {
    addTodoFn();
  } else if (e.key === "Escape") {
    closeModal();
  }
};

const main = () => {
  todos.innerHTML = "";
  showTime();
  if (getLocalStorage()) {
    todosList = getLocalStorage();
    for (let index = 0; index < todosList.length; index++)
      addTodoFn(false, index);
  }
  closeModal();
};

// RUNNERS
const timeInterval = setInterval(showTime, 1000);
addBtn.addEventListener("click", addTodoFn);
clearBtn.addEventListener("click", clearEverythingModal);
document.addEventListener("keydown", keyboardControl);
document.addEventListener("DOMContentLoaded", main);
document.getElementById("close-modal").addEventListener("click", closeModal);
modalContainer.addEventListener("click", closeModal);

document
  .getElementById("modal")
  .addEventListener("click", (e) => e.stopPropagation());
