const slidingMenu = document.getElementById("sliding-menu"),
  openMenuBtn = document.getElementById("open-menu-btn"),
  menuCloseBtn = document.getElementById("menu-close-btn");

openMenuBtn.addEventListener("click", () => {
  slidingMenu.classList.remove("closed");
});

menuCloseBtn.addEventListener("click", () => {
  slidingMenu.classList.add("closed");
});
