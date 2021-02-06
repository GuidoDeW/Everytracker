//To do: save params to tracker. Enable or disable "other" category on DOM load based on presence of "other" value
import * as Store from "./classes.js";

const slidingMenu = document.getElementById("sliding-menu"),
  openMenuBtn = document.getElementById("open-menu-btn"),
  closeMenuBtn = document.getElementById("close-menu-btn"),
  sheetList = document.getElementById("sheet-list"),
  newSheetBtn = document.getElementById("new-sheet-btn"),
  deleteSheetBtn = document.getElementById("delete-sheet-btn"),
  compareBtn = document.getElementById("compare-btn"),
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

//Class "module starts here"

function updateUI() {
  //Add button to sheet list for each sheet
  //Add current sheet info to UI params
  //Add current sheet columns to UI
}

// To init app, run tracker.getCurrentSheet(), and load it into the UI.
// Class "module" ends here

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

function applyInputStyle() {
  paramsTitle.classList.add("text-ac");
  paramsTitle.classList.add("fontw-700");
}

function removeInputStyle() {
  paramsTitle.classList.remove("text-ac");
  paramsTitle.classList.remove("fontw-700");
  paramsTitle.placeholder = "What do you want to track?";
}

function toggleInputStyle(e) {
  if (
    e.target !== paramsTitle ||
    (e.target === paramsTitle &&
      e.type == "keydown" &&
      (e.key == "Enter" || e.keyCode == 13))
  ) {
    if (paramsTitle.value.trim().length == 0) {
      removeInputStyle();
    } else {
      applyInputStyle();
    }
  }
}

function closeSlidingMenu() {
  slidingMenu.classList.add("closed");
}

function capitalize(str) {
  return `${
    str.trim().split("")[0].toUpperCase() +
    str.split("").slice(1, str.length).join("")
  }`;
}

function applyOtherInterval() {
  if (paramsOtherInterval.value.trim().length > 0) {
    const otherInterval = capitalize(paramsOtherInterval.value);
    document.querySelectorAll(".data-col").forEach((column) => {
      column.querySelector(".data-col-interval").innerText = otherInterval;
    });
    const currentSheet = Store.getCurrentSheet();
    currentSheet.interval = otherInterval;
    currentSheet.interval_index = 6;
    Store.updateSheet(Store.getTracker(), currentSheet);
    // Save "applied" boolean (or update DataColumn HTML template, and all existing DataColumns)
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

paramsTitle.addEventListener("input", (e) => {
  const currentSheet = Store.getCurrentSheet();
  const newTitle =
    e.target.value.trim().length > 0 ? capitalize(e.target.value) : "";
  currentSheet.title = newTitle;
  //Not the problem
  document.getElementById(`sheet-btn-${currentSheet.id}`).innerText =
    e.target.value.length > 0 ? newTitle : "Sheet";
  // When run on the first sheet (i.e. not added by the user), this somehow causes other
  // sheets in LS to take on id 1 as well.
  Store.updateSheet(Store.getTracker(), currentSheet);
});

function switchOtherParams(bool) {
  if (bool) {
    allParamsOthers.forEach((param) => {
      param.classList.remove("disabled");
      param.removeAttribute("disabled");
    });
  } else {
    allParamsOthers.forEach((param) => {
      param.classList.add("disabled");
      param.setAttribute("disabled", "true");
    });
    paramsOtherInterval.value = "";
  }
}

paramsInterval.addEventListener("input", (e) => {
  if (paramsInterval.selectedIndex < 6) {
    switchOtherParams(false);
    const currentSheet = Store.getCurrentSheet();
    currentSheet.interval = e.target.value;
    currentSheet.interval_index = paramsInterval.selectedIndex;
    Store.updateSheet(Store.getTracker(), currentSheet);
    const sheetInterval = capitalize(paramsInterval.value);
    sheetContainer.querySelectorAll(".data-col").forEach((column) => {
      column.querySelector(".data-col-interval").innerText = sheetInterval;
    });
  } else {
    switchOtherParams(true);
    paramsOtherInterval.focus();
  }
});

applyOthersBtn.addEventListener("click", applyOtherInterval);

paramsOtherInterval.addEventListener("keydown", (e) => {
  if (e.key == "Enter" || e.keyCode == 13) {
    applyOtherInterval();
  }
});

// Popup visuals

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

function removeColumn(column, bool) {
  if (document.querySelectorAll(".data-col").length === 1) {
    displayPopup(columnLimitPopup, false);
  } else if (
    (column.querySelector(".data-col-result").value.trim() !== "" ||
      column.querySelector(".data-col-comments").value.trim() !== "") &&
    !bool
  ) {
    const popupDeleteColumn = () => {
      removeColumn(column, true);
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
    //Work id into column node
    //Get sheet and remove column based on id
    //Update UI based on remaining columns
    //Save remaining columns
    const deleteId = Number(column.id.replace("data-col-", ""));
    Store.deleteColumn(deleteId);

    sheetContainer.querySelectorAll(".data-col").forEach((column) => {
      sheetContainer.removeChild(column);
    });
    loadAllColumns(Store.getCurrentSheet());
  }
}

function createColumn() {
  const allColumns = document.querySelectorAll(".data-col");
  if (allColumns.length >= 30) {
    displayPopup(columnLimitPopup, true);
  } else {
    Store.addColumn();
    const newColumn = Store.getCurrentSheet().columns[
      Store.getCurrentSheet().columns.length - 1
    ];
    allColumns.forEach((item) => {
      item.querySelector(".data-col-btn.add").style.visibility = "hidden";
    });

    loadColumn(newColumn);
    const latestColumn = sheetContainer.querySelectorAll(".data-col")[
      sheetContainer.querySelectorAll(".data-col").length - 1
    ];
    scroll({
      top:
        latestColumn.offsetTop -
        (window.innerHeight - latestColumn.getBoundingClientRect().height),
      behavior: "smooth",
    });
  }
}

function loadColumn(column) {
  const newColumn = document.createElement("div");
  const allLoadedColumns = sheetContainer.querySelectorAll(".data-col");
  const sheetInterval = capitalize(Store.getCurrentSheet().interval);
  newColumn.id = `data-col-${column.id}`;
  newColumn.className = "data-col";
  newColumn.innerHTML = `<div class="data-col-bar">
                              <h3>
                                <i class="fas fa-times data-col-btn delete"></i>
                              </h3>
                            </div>
                            <div class="data-col-bar title-bar">
                              <h3 class="data-col-interval-text">
                                <span class="data-col-interval">${sheetInterval}</span>&nbsp;<span class="data-col-count">
                                ${allLoadedColumns.length + 1}
                                </span>
                              </h3>
                              <h3>
                                <i class="fas fa-plus-square data-col-btn add"></i>
                              </h3>
                            </div>
                            <label for="result">Result</label>
                            <input name="result" type="number" class="data-col-result" value="${
                              column.result.length > 0 ? column.result : ""
                            }"/>
                            <p>Comments</p>
                            <textarea
                              name="comments"
                              cols="30"
                              rows="5"
                              class="data-col-comments"
                            >${
                              column.comments.length > 0 ? column.comments : ""
                            }</textarea>`;
  newColumn
    .querySelector(".data-col-btn.delete")
    .addEventListener("click", () => {
      removeColumn(newColumn, false);
    });
  newColumn
    .querySelector(".data-col-btn.add")
    .addEventListener("click", createColumn);
  newColumn.querySelector(".data-col-result").addEventListener("input", (e) => {
    Store.updateColumnProp(column.id, "result", e.target.value);
  });
  newColumn
    .querySelector(".data-col-comments")
    .addEventListener("input", (e) => {
      Store.updateColumnProp(column.id, "comments", e.target.value);
    });
  allLoadedColumns.forEach((column) => {
    column.querySelector(".data-col-btn.add").style.visibility = "hidden";
  });
  sheetContainer.appendChild(newColumn);
}

// Load columns from "API"
function loadAllColumns(sheet) {
  sheetContainer.querySelectorAll(".data-col").forEach((column) => {
    sheetContainer.removeChild(column);
  });
  sheet.columns.forEach((column) => {
    loadColumn(column);
  });
}

function loadSheet(sheet) {
  //Select appropriate sheet button
  paramsTitle.value = sheet.title;
  if (sheet.title.length > 0) {
    applyInputStyle();
  }
  paramsQuantity.value = sheet.quantity;
  paramsInterval.selectedIndex = sheet.interval_index;
  if (sheet.interval_index == 6) {
    switchOtherParams(true);
    paramsOtherInterval.value = sheet.interval;
  } else {
    switchOtherParams(false);
  }
  loadAllColumns(sheet);
}

function changeCurrentSheet(bool) {
  const currentSheet = Store.getCurrentSheet();
  loadSheet(currentSheet);
  if (bool) {
    insertSheetBtn(currentSheet);
  }
  highlightCurrentBtn();
}

newSheetBtn.addEventListener("click", () => {
  Store.addSheet();
  changeCurrentSheet(true);
});

function insertSheetBtn(sheet) {
  const sheetBtn = document.createElement("button");
  const newSheetId = sheet.id;
  sheetBtn.id = `sheet-btn-${newSheetId}`;
  sheetBtn.className =
    "sheet-btn btn btn-s btn-default half-width sheet-link mt-1";
  sheetBtn.innerText = sheet.title.length > 0 ? sheet.title : "Sheet";
  sheetBtn.addEventListener("click", () => {
    Store.setCurrentSheet(newSheetId);
    changeCurrentSheet(false);
  });
  sheetList.appendChild(sheetBtn);
}

function highlightCurrentBtn() {
  document.querySelectorAll(".sheet-btn").forEach((btn) => {
    Number(btn.id.replace("sheet-btn-", "")) == Store.getCurrentSheet().id
      ? btn.classList.add("current")
      : btn.classList.remove("current");
  });
}

function loadMenu() {
  Store.getTracker().sheets.forEach((sheet) => {
    insertSheetBtn(sheet);
  });
  highlightCurrentBtn();
}

loadSheet(Store.getCurrentSheet());
loadMenu();
//Not the problem
Store.updateSheet(Store.getTracker(), Store.getCurrentSheet());
