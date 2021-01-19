const slidingMenu = document.getElementById("sliding-menu"),
  openMenuBtn = document.getElementById("open-menu-btn"),
  menuCloseBtn = document.getElementById("menu-close-btn"),
  paramsTitle = document.getElementById("params-title"),
  paramsQuantity = document.getElementById("params-quantity"),
  paramsInterval = document.getElementById("params-interval"),
  paramsOtherInterval = document.getElementById("params-other-interval"),
  defaultInputFields = [
    paramsTitle,
    paramsQuantity,
    paramsInterval,
    paramsOtherInterval,
  ],
  allParamsOthers = document.querySelectorAll(".params-other"),
  applyOthersBtn = document.getElementById("apply-others-btn"),
  sheetContainer = document.getElementById("sheet-container"),
  dataColumnsArray = Array.from(document.querySelectorAll(".data-col")),
  lastColumnPopup = document.getElementById("last-col-popup"),
  lastColumnPopupBtns = lastColumnPopup.querySelectorAll(".btn"),
  confirmDeletePopup = document.getElementById("confirm-delete-popup"),
  confirmDeleteBtn = document.getElementById("confirm-delete-btn"),
  cancelDeleteBtn = document.getElementById("cancel-delete-btn");

function toggleInputStyle(e) {
  if (
    e.target !== paramsTitle ||
    (e.target === paramsTitle && e.type == "keydown" && e.key == "Enter") ||
    e.keyCode == 13
  ) {
    if (paramsTitle.value.trim().length == 0) {
      paramsTitle.classList.remove("text-ac");
      paramsTitle.classList.remove("fontw-700");
      paramsTitle.placeholder = "What do you want to track?";
    } else {
      paramsTitle.classList.add("text-ac");
      paramsTitle.classList.add("fontw-700");
    }
  }
}

defaultInputFields.forEach((field) => {
  field.addEventListener("keydown", (e) => {
    if (e.key == "Enter" || e.keyCode === 13) {
      defaultInputFields.indexOf(e.target) < defaultInputFields.length - 1
        ? defaultInputFields[defaultInputFields.indexOf(e.target) + 1].focus()
        : e.target.blur();
      //Modify function to immediately apply other interval upon enter keypress
    }
  });
});

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
        paramsOtherInterval.value = "";
      })
    : allParamsOthers.forEach((param) => {
        param.classList.remove("disabled");
        param.removeAttribute("disabled");
        paramsOtherInterval.focus();
      });
});

applyOthersBtn.querySelector("click", () => {
  if (paramsOtherInterval.value.trim().length > 0) {
    // Save "applied" boolean (or update DataColumn HTML template, and all existing DataColumns)
  }
});

//DataColumn functionality

function displayPopup(popup) {
  popup.style.transform = "translate(-50%, -50%)";
}

function hidePopup(popup) {
  popup.style.transform = "translate(-1000%, -1000%)";
}

lastColumnPopupBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    hidePopup(lastColumnPopup);
  });
});

confirmDeleteBtn.addEventListener("click", () => {
  hidePopup(confirmDeletePopup);
});

function deleteColumn(column, bool) {
  if (document.querySelectorAll(".data-col").length === 1) {
    displayPopup(lastColumnPopup);
  } else if (
    (column.querySelector(".data-col-result").value.trim() !== "" ||
      column.querySelector(".data-col-comments").value.trim() !== "") &&
    !bool
  ) {
    function popupDeleteColumn() {
      deleteColumn(column, true);
    }
    confirmDeleteBtn.addEventListener("click", popupDeleteColumn);

    confirmDeletePopup.querySelectorAll(".btn").forEach((btn) => {
      if (btn !== confirmDeleteBtn) {
        btn.addEventListener(
          "click",
          () => {
            confirmDeleteBtn.removeEventListener("click", popupDeleteColumn);
            hidePopup(confirmDeletePopup);
          },
          { once: true }
        );
      }
    });
    displayPopup(confirmDeletePopup);
  } else {
    sheetContainer.removeChild(column);
    let columnCount = 1;
    document.querySelectorAll(".data-col").forEach((column) => {
      column.querySelector(".data-col-count").innerText = `${columnCount}`;
      columnCount++;
    });
    document
      .querySelectorAll(".data-col")
      [document.querySelectorAll(".data-col").length - 1].querySelector(
        ".data-col-btn.add"
      ).style.visibility = "visible";
  }
}

// Invoke this function whenever a new sheet is created
function createColumn() {
  const newColumn = document.createElement("div");
  newColumn.innerHTML = document.querySelectorAll(".data-col")[
    document.querySelectorAll(".data-col").length - 1
  ].innerHTML;
  newColumn.querySelector(".data-col-count").innerText =
    document.querySelectorAll(".data-col").length + 1;
  newColumn.querySelector(".data-col-result").value = "";
  newColumn.querySelector(".data-col-comments").value = "";
  newColumn
    .querySelector(".data-col-btn.delete")
    .addEventListener("click", () => {
      deleteColumn(newColumn, false);
    });
  newColumn
    .querySelector(".data-col-btn.add")
    .addEventListener("click", addColumn);

  newColumn.classList.add("data-col");
  return newColumn;
}

function addColumn() {
  const newColumn = createColumn();
  document.querySelectorAll(".data-col").forEach((column) => {
    column.querySelector(".data-col-btn.add").style.visibility = "hidden";
  });
  sheetContainer.appendChild(newColumn);
}

// Update this function once bogus API has been created (insert columns based on sheet object)
document.querySelectorAll(".data-col").forEach((column) => {
  column.querySelector(".data-col-btn.delete").addEventListener("click", () => {
    deleteColumn(column, false);
  });
  column
    .querySelector(".data-col-btn.add")
    .addEventListener("click", addColumn);
});
