const slidingMenu = document.getElementById("sliding-menu"),
  openMenuBtn = document.getElementById("open-menu-btn"),
  menuCloseBtn = document.getElementById("menu-close-btn"),
  paramsTitle = document.getElementById("params-title"),
  paramsQuantity = document.getElementById("params-quantity"),
  paramsInterval = document.getElementById("params-interval"),
  paramsOtherInterval = document.getElementById("params-other-interval"),
  allParamsOthers = document.querySelectorAll(".params-other");

function toggleInputStyle(e) {
  if (
    e.target !== paramsTitle ||
    (e.target === paramsTitle && e.type == "keydown" && e.keyCode == 13)
  ) {
    if (paramsTitle.value.trim().length == 0) {
      paramsTitle.classList.remove("text-ac");
      paramsTitle.classList.remove("fontw-700");
      paramsTitle.placeholder = "What do you want to track?";
    } else {
      paramsTitle.classList.add("text-ac");
      paramsTitle.classList.add("fontw-700");
    }
    paramsTitle.blur();
  }
}

openMenuBtn.addEventListener("click", () => {
  slidingMenu.classList.remove("closed");
});

menuCloseBtn.addEventListener("click", () => {
  slidingMenu.classList.add("closed");
});

paramsTitle.addEventListener("focus", (e) => {
  e.target.placeholder = "";
  e.target.classList.remove("text-ac");
  e.target.classList.remove("fontw-700");
});

document.addEventListener("click", toggleInputStyle);
paramsTitle.addEventListener("keydown", toggleInputStyle);
paramsInterval.addEventListener("input", () => {
  paramsInterval.selectedIndex < 6
    ? allParamsOthers.forEach((param) => {
        param.classList.add("disabled");
        param.setAttribute("disabled", "true");
      })
    : allParamsOthers.forEach((param) => {
        param.classList.remove("disabled");
        param.removeAttribute("disabled");
      });
});
