const riddles = [
  {
    target: "shadow",
    hint: "I follow you all the time and copy your every move, but you can’t touch me or catch me. What am I?",
  },
  {
    target: "piano",
    hint: "What has many keys but can’t open a single lock?",
  },
  {
    target: "chalkboard",
    hint: "What is black when it’s clean and white when it’s dirty?",
  },
  {
    target: "secret",
    hint: "If you’ve got me, you want to share me; if you share me, you haven’t kept me. What am I?",
  },
  {
    target: "envelope",
    hint: "What begins with an 'e' and only contains one letter?",
  },
  {
    target: "chicago",
    hint: "What is 3/7 chicken, 2/3 cat and 2/4 goat?",
  },
  {
    target: "stone",
    hint: "What word of five letters has one left when two are removed?",
  },
  {
    target: "heroine",
    hint: "What word in the English language does the following: The first two letters signify a male, the first three letters signify a female, the first four letters signify a great, while the entire world signifies a great woman. What is the word?",
  },
  {
    target: "river",
    hint: "What can run but never walks, has a mouth but never talks, has a head but never weeps, has a bed but never sleeps?",
  },
  {
    target: "stapler",
    hint: "With pointed fangs I sit and wait; with piercing force I crunch out fate; grabbing victims, proclaiming might; physically joining with a single bite. What am I?",
  },
];

const LIMIT = 6;
const numberOfRiddles = riddles.length;
let numberOfIncorrectLetters = 0;
let hiddenWordArray = [];
let foundWordArray = [];
let numberOfFoundLetter = 0;

// Create Game board
document.body.innerHTML = `
  <div id="root">
    <div class="game-container">
      <div id="modal" class="modal"></div>
      <!-- Image Container -->
      <section class="image-container">
        <img class="gallows" src="./assets/gallows.png" alt="gallows image" />
        <div class="human-container">
          <div class="human-image">
            <img
              id="human-1"
              class="head"
              src="./assets/head.png"
              alt="head image"
            />
            <img
              id="human-2"
              class="body"
              src="./assets/body.png"
              alt="body image"
            />
            <img
              id="human-3"
              class="hand-one"
              src="./assets/hand-one.png"
              alt="hand one image"
            />
            <img
              id="human-4"
              class="hand-two"
              src="./assets/hand-two.png"
              alt="hand two image"
            />
            <img
              id="human-5"
              class="leg-one"
              src="./assets/leg-one.png"
              alt="leg one image"
            />
            <img
              id="human-6"
              class="leg-two"
              src="./assets/leg-two.png"
              alt="leg two image"
            />
          </div>
        </div>
        <h1>HANGMAN GAME</h1>
      </section>

      <!-- Game Body -->
      <article class="game">
        <div class="hidden-string"></div>
        <p>Hint: <span class="hint-message"></span></p>
        <p>Incorrect guesses: <span class="incorrect-count"></span></p>
        <div class="virtual-keyboard"></div>
      </article>
    </div>
  </div>`;

const humanImage = document.querySelector(".human-image");
const hiddenString = document.querySelector(".hidden-string");
const hintMessage = document.querySelector(".hint-message");
const incorrectCount = document.querySelector(".incorrect-count");
const virtualKeyboard = document.querySelector(".virtual-keyboard");
const modal = document.getElementById("modal");

const startGameWithEnterKey = (e) => {
  if (e.key === "Enter") startGame();
};

const showModal = (isWin) => {
  lockGame();
  modal.classList.remove("hidden");
  modal.classList.remove("failed");
  modal.classList.remove("success");
  // Update Modal
  modal.innerHTML = "";
  const modalDiv = document.createElement("div");
  const modalMessage = document.createElement("p");
  const modalAnswer = document.createElement("b");
  const modalBtn = document.createElement("button");
  // Text Content
  modalAnswer.textContent = `The Answer is: ${hiddenWordArray
    .join("")
    .toUpperCase()}`;
  modalBtn.textContent = "Play Again";
  modalBtn.addEventListener("click", startGame);
  modalDiv.appendChild(modalMessage);
  modalDiv.appendChild(modalAnswer);
  modalDiv.appendChild(modalBtn);
  modal.appendChild(modalDiv);

  if (isWin) {
    modalMessage.textContent = `Congratulations! You Win! You found the word by making ${numberOfIncorrectLetters} incorrect guesses from ${LIMIT}`;
    modal.classList.add("success");
  } else {
    modalMessage.textContent = `Unfortunately, You Lose. You found ${numberOfFoundLetter} correct letters but there are ${hiddenWordArray.length}`;
    modal.classList.add("failed");
  }

  document.addEventListener("keyup", startGameWithEnterKey);
};

const getRandomRiddle = () => {
  const randomIndex = Math.floor(numberOfRiddles * Math.random());
  return riddles[randomIndex];
};

const showFoundWord = () => {
  hiddenString.innerHTML = "";
  foundWordArray.forEach((letter) => {
    const div = document.createElement("div");
    div.classList.add("letter");
    div.textContent = letter;
    hiddenString.appendChild(div);
  });
  if (numberOfFoundLetter === hiddenWordArray.length) showModal(true);
};

const setIncorrectLetters = (incorrects) => {
  numberOfIncorrectLetters = incorrects;
  incorrectCount.textContent = `${incorrects}/${LIMIT}`;
  if (incorrects >= LIMIT) showModal(false);
};

const incrementIncorrectCount = () => {
  if (numberOfIncorrectLetters >= LIMIT) return;
  Array.from(humanImage.children)[numberOfIncorrectLetters].classList.remove(
    "hidden"
  );
  numberOfIncorrectLetters += 1;
  setIncorrectLetters(numberOfIncorrectLetters);
};

const setFoundWord = (index, letter) => {
  numberOfFoundLetter += 1;
  foundWordArray[index] = letter;
  showFoundWord();
};

const checkLetter = (event) => {
  const letter = event.target.textContent;
  if (foundWordArray.includes(letter)) return;
  event.target.disabled = true;
  let flag = false;
  for (let index = 0; index < hiddenWordArray.length; index += 1) {
    const char = hiddenWordArray[index];
    if (char.toUpperCase() === letter) {
      flag = true;
      setFoundWord(index, letter);
    }
  }
  if (!flag) {
    incrementIncorrectCount();
  }
};

const initializeUnits = () => {
  numberOfIncorrectLetters = 0;
  hiddenWordArray = [];
  foundWordArray = [];
  numberOfFoundLetter = 0;
  modal.classList.add("hidden");
  document.removeEventListener("keyup", startGameWithEnterKey);
};

const lockGame = () => {
  document.removeEventListener("keyup", convertFromDynamicToVirtualKeyUp);
  Array.from(virtualKeyboard.children).forEach((key) =>
    key.removeEventListener("click", checkLetter)
  );
};

const convertFromDynamicToVirtualKeyUp = (e) => {
  const keyCode = e.key.toUpperCase().charCodeAt(0) - 65;
  if (keyCode >= 0 && keyCode < 26)
    Array.from(virtualKeyboard.children)[keyCode].click();
};

const startGame = () => {
  const { target, hint } = getRandomRiddle();
  initializeUnits();
  // Array of Letters
  hiddenWordArray = target.split("");
  foundWordArray = new Array(hiddenWordArray.length).fill("");
  //   Fill the Game Field
  hiddenString.textContent = target;
  hintMessage.textContent = hint;
  virtualKeyboard.innerHTML = "";
  //   Virtual Keyboard
  for (let i = 65; i < 91; i += 1) {
    const char = String.fromCharCode(i);
    const button = document.createElement("button");
    button.addEventListener("click", checkLetter);
    button.textContent = char;
    virtualKeyboard.appendChild(button);
  }
  //  Dynamic Keyboard
  document.addEventListener("keyup", convertFromDynamicToVirtualKeyUp);
  // Hide Human
  Array.from(humanImage.children).forEach((el) => el.classList.add("hidden"));
  //   For Game
  setIncorrectLetters(0);
  showFoundWord();
};

document.addEventListener("DOMContentLoaded", startGame);
