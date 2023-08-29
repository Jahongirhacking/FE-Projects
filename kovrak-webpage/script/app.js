// Global Variables
const arrowUpBtn = document.querySelector(".arrow-up-btn");
const toggleModeBtn = document.querySelector(".toggle-mode-btn");
const footer = document.getElementById("contact");
const formBtn = document.querySelector(".form__btn");
const overlay = document.querySelector(".overlay");
let isDarkMode = false;

// Functions
const handleScroll = (e) => {
  const navbar = document.querySelector(".navbar");
  //   Make Navbar visible
  if (window.scrollY >= 70) {
    navbar.classList.remove("invisible");
    arrowUpBtn.classList.remove("hidden");
    // Todo: Make arrow up sticky
    const offsetToFooter = footer.offsetTop - arrowUpBtn.offsetHeight - 20;
    if (window.scrollY + window.innerHeight < offsetToFooter) {
      arrowUpBtn.style.position = "fixed";
      arrowUpBtn.style.bottom = "20px";
    } else {
      arrowUpBtn.style.position = "absolute";
      arrowUpBtn.style.bottom = `${footer.offsetHeight + 20}px`;
    }
  } else {
    navbar.classList.add("invisible");
    arrowUpBtn.classList.add("hidden");
  }
};

const handleMode = () => {
  isDarkMode = !isDarkMode;
  document.querySelector(".fa-moon").classList.toggle("destroyed");
  document.querySelector(".fa-sun").classList.toggle("destroyed");
  if (isDarkMode) {
    document.documentElement.style.setProperty("--secondary-color", "#0c0c0c");
    document.documentElement.style.setProperty("--primary-text", "white");
    document.documentElement.style.setProperty("--secondary-text", "white");
  } else {
    document.documentElement.style.setProperty(
      "--secondary-color",
      "aliceblue"
    );
    document.documentElement.style.setProperty("--primary-text", "#0e3842");
    document.documentElement.style.setProperty("--secondary-text", "black");
  }
};

const handleForm = (e) => {
  e.preventDefault();
};

const handleDocuments = (index) => {
  const qrCode = document.getElementById("qr-code");
  qrCode.addEventListener("click", (e) => e.stopPropagation());
  qrCode.setAttribute("src", `../assets/qr-${index}.jpg`);
  overlay.classList.remove("destroyed");
};

const closeModal = () => {
  overlay.classList.add("destroyed");
};

// Events
window.addEventListener("scroll", handleScroll);
toggleModeBtn.addEventListener("click", handleMode);
arrowUpBtn.addEventListener("click", () => window.scroll(0, 0));
formBtn.addEventListener("click", handleForm);
// work with documents qr-code
Array.from(document.querySelectorAll(".documents__btn")).forEach(
  (docBtn, index) => {
    docBtn.addEventListener("click", () => handleDocuments(index));
  }
);
overlay.addEventListener("click", closeModal);
window.addEventListener("keyup", (e) => {
  e.key === "Escape" && closeModal();
});

// Initial Calls
AOS.init();
handleScroll();
document.getElementById("current-year").textContent = new Date().getFullYear();
