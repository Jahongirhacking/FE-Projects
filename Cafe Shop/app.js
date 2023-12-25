let currentSlideNumber = 1;
let prevSlideNumber = 1;
let nextSlideNumber = 2;

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const slider = document.getElementById("slider");
const slidePortals = document.querySelectorAll(
  ".favorite__nav > .slide__portal"
);
const navPanel = document.querySelector(".nav__panel");

const currentSlideChanged = (slideNumber) => {
  // Number of slides
  const n = Array.from(slider.children).length;
  if (slideNumber < 1) slideNumber = 1;
  else if (slideNumber > n) slideNumber = n;

  location.hash = `slide-${slideNumber}`;

  document
    .querySelectorAll(".favorite__nav > a")
    .forEach((a) => a.classList.remove("active"));

  Array.from(slidePortals)[slideNumber - 1].classList.add("active");

  currentSlideNumber = slideNumber;
  if (slideNumber === 1) {
    prevSlideNumber = 1;
    nextSlideNumber = 2;
    leftBtn.classList.add("disabled");
    rightBtn.classList.remove("disabled");
  } else if (slideNumber === n) {
    prevSlideNumber = n - 1;
    nextSlideNumber = n;
    rightBtn.classList.add("disabled");
    leftBtn.classList.remove("disabled");
  } else {
    prevSlideNumber = currentSlideNumber - 1;
    nextSlideNumber = currentSlideNumber + 1;
    rightBtn.classList.remove("disabled");
    leftBtn.classList.remove("disabled");
  }
};

const handleResize = () => {
  if (window.innerWidth < 760) {
    document.querySelector(".nav__panel").classList.add("hidden");
    document.querySelector(".nav > i.fa-bars").classList.remove("hidden");
  } else {
    document.querySelector(".nav__panel").classList.remove("hidden");
    document.querySelector(".nav > i.fa-bars").classList.add("hidden");
  }
};

const handleNavPanel = () => {
  navPanel.classList.toggle("active");
  navPanel.classList.toggle("hidden");
  document.querySelector(".nav > i.fa-bars").classList.toggle("hidden");
};

slidePortals.forEach((a, index) => {
  a.setAttribute("data-id", index + 1);
  a.addEventListener("click", () =>
    currentSlideChanged(Number(a.getAttribute("data-id")))
  );
});

leftBtn.addEventListener("click", () => {
  currentSlideChanged(prevSlideNumber);
});

rightBtn.addEventListener("click", () => {
  currentSlideChanged(nextSlideNumber);
});

window.addEventListener("resize", handleResize);
document.addEventListener("DOMContentLoaded", () => {
  handleResize();
});

document
  .querySelector(".nav > i.fa-bars")
  .addEventListener("click", handleNavPanel);

navPanel.addEventListener("click", () => {
  if (navPanel.classList.contains("active")) {
    handleNavPanel();
  }
});
