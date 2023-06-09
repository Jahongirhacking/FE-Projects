const switchToDark = document.getElementById("moon-icon");
const switchToLight = document.getElementById("sun-icon");
const cardContainer = document.getElementById("card-container");
const overlay = document.querySelector(".overlay");
const inputText = document.getElementById("search-user");
const clearBtn = document.getElementById("clear-btn");
const refreshBtn = document.getElementById("refresh-btn");
const apiURL = "https://randomuser.me/api/?results=9";
let users = new Array();
let searchText = "";

const switchToDarkFn = () => {
  document.querySelector("body").classList.remove("light");
  document.querySelector("body").classList.add("dark");
  switchToDark.classList.add("hidden");
  switchToLight.classList.remove("hidden");
  localStorage.setItem("theme", "dark");
};

const switchToLightFn = () => {
  document.querySelector("body").classList.remove("dark");
  document.querySelector("body").classList.add("light");
  switchToLight.classList.add("hidden");
  switchToDark.classList.remove("hidden");
  localStorage.setItem("theme", "light");
};

const getUsersData = (apiPath) => {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.addEventListener("readystatechange", () => {
      if (req.readyState === 4 && req.status === 200) {
        overlay.classList.add("hidden");
        resolve(req.responseText);
      } else if (req.responseText === 4) {
        reject("ERROR!");
      } else {
        // LOADER
        overlay.classList.remove("hidden");
      }
    });
    req.open("GET", apiPath);
    req.send();
  });
};

const findParent = (element, targetTagName) => {
  while (element.tagName !== targetTagName) {
    element = element.parentElement;
  }
  return element;
};

const cardMouseOver = (e) => {
  let element = e.target;
  element = findParent(element, "DIV");
  element.children[5].classList.remove("hidden");
};

const cardMouseOut = (e) => {
  let element = e.target;
  element = findParent(element, "DIV");
  element.children[5].classList.add("hidden");
};

const showUsers = (usersArray) => {
  checkClearButton();
  cardContainer.innerHTML = "";
  usersArray.map(
    (elem) =>
      (cardContainer.innerHTML += `
  <div class="card" data-username="${elem.login.username}">
    <img src="${elem.picture.medium}" alt="image" />
    <p class="user-name"><i class="fa-solid fa-id-card"></i> - ${
      elem.name.title
    } ${elem.name.first} ${elem.name.last}</p>
    <p class="user-age"><i class="fa-solid fa-cake-candles"></i> - ${
      elem.dob.age
    } years</p>
    <p class="user-location"><i class="fa-solid fa-location-dot"></i> - ${
      elem.location.city
    }, ${elem.location.country}</p>
    <p class="user-gender">${
      elem.gender === "male"
        ? `<i class="fa-solid fa-person"></i>`
        : `<i class="fa-solid fa-person-dress"></i>`
    } - ${elem.gender}</p>
    <i class="fa-solid fa-trash delete-user hidden"></i>
  </div>
  `)
  );
  Array.from(cardContainer.children).forEach((card) => {
    card.addEventListener("mouseover", cardMouseOver);
    card.addEventListener("mouseout", cardMouseOut);
    card.children[5].addEventListener("click", deleteUserFn);
  });
  // filterUsers();
};

const updateUsersArray = (usersArray) => {
  users = usersArray;
  localStorage.setItem("users", JSON.stringify(users));
  showUsers(filterUsers(users));
};

const generateUsers = () => {
  getUsersData(apiURL)
    .then((data) => JSON.parse(data))
    .then((parsedData) => parsedData.results)
    .then((res) => updateUsersArray(res))
    .catch((err) => console.error(err));
};

const deleteUserFn = (e) => {
  e.stopPropagation();
  const parent = e.target.parentElement;
  const username = parent.getAttribute("data-username");
  updatedUsers = users.filter((el) => el.login.username !== username);
  updateUsersArray(updatedUsers);
  parent.remove();
};

const filterUsers = () => {
  return users.filter(
    (el) =>
      (el.name.title + " " + el.name.first + " " + el.name.last)
        .toLowerCase()
        .search(searchText.toLowerCase()) !== -1
  );
};

const showfilteredUsers = () => {
  if (searchText === "") showUsers(users);
  else {
    showUsers(filterUsers());
  }
};

const onInputChange = (e) => {
  searchText = e.target.value;
  localStorage.setItem("searchText", searchText);
  showfilteredUsers();
};

const checkClearButton = () => {
  if (users.length === 0) clearBtn.classList.add("hidden");
  else clearBtn.classList.remove("hidden");
};

const refreshFn = (e) => {
  e.preventDefault();
  generateUsers();
};

const clearFn = (e) => {
  e.preventDefault();
  updateUsersArray([]);
  checkClearButton();
};

const main = () => {
  const themeColor = localStorage.getItem("theme");
  const localUsers = localStorage.getItem("users");
  const searchedText = localStorage.getItem("searchText");
  if (themeColor) {
    if (themeColor === "dark") switchToDarkFn();
    else switchToLightFn();
  }
  if (searchedText) {
    searchText = searchedText;
    inputText.value = searchText;
  }
  if (localUsers) {
    users = JSON.parse(localUsers);
    showUsers(filterUsers(users));
  } else {
    generateUsers();
  }
  checkClearButton();
};

document.addEventListener("DOMContentLoaded", main);
switchToDark.addEventListener("click", switchToDarkFn);
switchToLight.addEventListener("click", switchToLightFn);
inputText.addEventListener("keyup", onInputChange);
clearBtn.addEventListener("click", clearFn);
refreshBtn.addEventListener("click", refreshFn);
