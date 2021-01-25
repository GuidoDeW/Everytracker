const slidingMenu = document.getElementById("sliding-menu"),
  openMenuBtn = document.getElementById("open-menu-btn"),
  closeMenuBtn = document.getElementById("close-menu-btn"),
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
  columnLimitPopup = document.getElementById("col-limit-popup"),
  columnLimitPopupBtns = columnLimitPopup.querySelectorAll(".btn"),
  confirmDeletePopup = document.getElementById("confirm-delete-popup"),
  confirmDeleteBtn = document.getElementById("confirm-delete-btn"),
  cancelDeleteBtn = document.getElementById("cancel-delete-btn"),
  canvas = document.getElementById("graph");

// canvasContext.lineWidth = 1;
// canvasContext.shadowBlur = 5;

// Shortcut for easy testing
document.addEventListener("keydown", (e) => {
  if (e.key == "d") {
    drawGraph();
  }
});

function drawGraph(color) {
  // Solve blurry lines issue
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const canvasContext = canvas.getContext("2d");
  canvasContext.clearRect(
    0,
    0,
    canvasContext.canvas.width,
    canvasContext.canvas.height
  );

  const zeroY = canvasContext.canvas.height;
  const allResults = Array.from(document.querySelectorAll(".data-col")).map(
    (column) => {
      return Number(column.querySelector(".data-col-result").value);
    }
  );

  const interval =
    allResults.length <= 10
      ? Math.round(canvasContext.canvas.width / 10)
      : Math.round(canvasContext.canvas.width / (allResults.length - 1));

  let highestValue = allResults[0];
  for (let i = 0; i < allResults.length; i++) {
    if (allResults[i] > highestValue) {
      highestValue = allResults[i];
    }
  }

  const scale = highestValue / zeroY;
  canvasContext.strokeStyle = color ? color : "black";
  canvasContext.shadowColor = color ? color : "black";
  canvasContext.beginPath();
  for (let j = 1; j < allResults.length; j++) {
    canvasContext.moveTo((j - 1) * interval, zeroY - allResults[j - 1] / scale);
    canvasContext.lineTo(j * interval, zeroY - allResults[j] / scale);
  }
  canvasContext.stroke();
}

document.addEventListener("keydown", (e) => {
  if (e.key == "Enter" || e.keyCode == 13) {
    hidePopup(columnLimitPopup);
  }
});

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

function closeSlidingMenu() {
  slidingMenu.classList.add("closed");
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
  slidingMenu.classList.toggle("closed");
});

closeMenuBtn.addEventListener("click", closeSlidingMenu);

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

function displayPopup(popup, max) {
  if (popup === columnLimitPopup) {
    columnLimitPopup.querySelector("p").innerText = max
      ? "You can track a maximum of 30 intervals per data sheet."
      : "Your data sheet must contain at least one column.";
  }
  popup.style.transform = "translate(-50%, -50%)";
  if (
    !slidingMenu.classList.contains("closed") &&
    popup.getBoundingClientRect().left <
      slidingMenu.getBoundingClientRect().right
  ) {
    closeSlidingMenu();
  }
}

function hidePopup(popup) {
  popup.style.transform = "translate(-1000%, -1000%)";
}

columnLimitPopupBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    hidePopup(columnLimitPopup);
  });
});

confirmDeleteBtn.addEventListener("click", () => {
  hidePopup(confirmDeletePopup);
});

function deleteColumn(column, bool) {
  if (document.querySelectorAll(".data-col").length === 1) {
    displayPopup(columnLimitPopup, false);
  } else if (
    (column.querySelector(".data-col-result").value.trim() !== "" ||
      column.querySelector(".data-col-comments").value.trim() !== "") &&
    !bool
  ) {
    const popupDeleteColumn = () => {
      deleteColumn(column, true);
    };
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
    const allCols = document.querySelectorAll(".data-col");
    allCols.forEach((column) => {
      column.querySelector(".data-col-count").innerText = `${columnCount}`;
      columnCount++;
    });
    const lastCol = allCols[allCols.length - 1];
    lastCol.querySelector(".data-col-btn.add").style.visibility = "visible";
    //Scrolling into view upon removal may not be user-friendly; users may want to
    // remove multiple adjacent columns
    /*
    scroll({
      top:
        lastCol.offsetTop -
        (window.innerHeight - lastCol.getBoundingClientRect().height),
      behavior: "smooth",
    }); 
    */
  }
}

// Invoke this function whenever a new sheet is created
function createColumn() {
  const column = document.createElement("div");
  column.innerHTML = document.querySelectorAll(".data-col")[
    document.querySelectorAll(".data-col").length - 1
  ].innerHTML;
  column.querySelector(".data-col-count").innerText =
    document.querySelectorAll(".data-col").length + 1;
  column.querySelector(".data-col-result").value = "";
  column.querySelector(".data-col-comments").value = "";
  column.querySelector(".data-col-btn.delete").addEventListener("click", () => {
    deleteColumn(column, false);
  });
  column
    .querySelector(".data-col-btn.add")
    .addEventListener("click", addColumn);

  column.classList.add("data-col");
  return column;
}

function addColumn() {
  const allColumns = document.querySelectorAll(".data-col");
  if (allColumns.length >= 30) {
    displayPopup(columnLimitPopup, true);
  } else {
    const newColumn = createColumn();
    allColumns.forEach((column) => {
      column.querySelector(".data-col-btn.add").style.visibility = "hidden";
    });
    sheetContainer.appendChild(newColumn);
    // Scroll new column into view
    scroll({
      top:
        newColumn.offsetTop -
        (window.innerHeight - newColumn.getBoundingClientRect().height),
      behavior: "smooth",
    });
  }
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
