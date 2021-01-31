//To do: save params to tracker. Enable or disable "other" category on DOM load based on presence of "other" value

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

//Class "module starts here"
class Tracker {
  constructor() {
    this.new_sheet_id = 2;
    this.current_sheet_id = 1;
    //Consider if this is necessary (benefit: save configuration for new sheets)
    this.last_title = "";
    this.last_quantity = 1;
    this.last_interval = "day";
    this.sheets = [
      new DataSheet(1, this.last_title, this.last_quantity, this.last_interval),
    ];
  }
}

class DataSheet {
  // Create DataSheet with new DataSheet(new_sheet_id), and update new_sheet_id in "API" function.
  constructor(id, title, quantity, interval) {
    this.id = id;
    this.new_col_id = 2;
    this.columns = [new DataColumn(this.id, 1)];
    this.title = title;
    this.quantity = quantity;
    this.interval = interval;
  }
}

class DataColumn {
  constructor(sheet_id, id) {
    this.sheet_id = sheet_id;
    this.id = id;
    this.result = "";
    this.comments = "";
  }
}

function getTracker() {
  return localStorage.getItem("everytracker")
    ? JSON.parse(localStorage.getItem("everytracker"))
    : new Tracker();
}

function setTracker(item) {
  localStorage.setItem("everytracker", JSON.stringify(item));
}

function setCurrentSheet(id) {
  const tracker = getTracker();
  if (
    tracker.sheets.filter((sheet) => {
      return sheet.id === id;
    }).length > 0
  ) {
    tracker.current_sheet_id = id;
    setTracker(tracker);
  }
}

function getCurrentSheet() {
  const tracker = getTracker();
  return getTracker().sheets.filter((sheet) => {
    return sheet.id === tracker.current_sheet_id;
  })[0];
}

function addSheet() {
  const tracker = getTracker();
  const newSheet = new DataSheet(
    tracker.new_sheet_id,
    tracker.last_title,
    tracker.last_quantity,
    tracker.last_interval
  );
  tracker.sheets.push(newSheet);
  tracker.current_sheet_id = newSheet.id;
  tracker.new_sheet_id++;
  setTracker(tracker);
}

function updateSheet(tracker, sheet) {
  //Replace old sheet with updated version
  tracker.sheets.splice(tracker.sheets.indexOf(sheet), 1, sheet);
  //Update tracker props for new sheet according to current sheet param updates (if any)
  tracker.last_title = sheet.title;
  tracker.last_quantity = sheet.quantity;
  tracker.last_interval = sheet.interval;
  setTracker(tracker);
}

function deleteSheet(id) {
  const tracker = getTracker();
  tracker.sheets = tracker.sheets.filter((sheet) => {
    return sheet.id !== id;
  });
  setTracker(tracker);
}

function addColumn() {
  const currentSheet = getCurrentSheet();
  const newColumn = new DataColumn(currentSheet.id, currentSheet.new_col_id);
  currentSheet.columns.push(newColumn);
  currentSheet.new_col_id++;
  updateSheet(getTracker(), currentSheet);
}

function getColumn(id) {
  return getCurrentSheet().columns.filter((column) => {
    return column.id === id;
  })[0];
}

function updateColumnProp(id, key, value) {
  const column = getColumn(id);
  if (column.hasOwnProperty(key) && key !== "sheet_id" && key !== "id") {
    column[key] = value;
  }
  updateColumn(column);
}

function updateColumn(column) {
  const currentSheet = getCurrentSheet();
  currentSheet.columns.forEach((item, index) => {
    if (item.id === column.id) {
      currentSheet.columns.splice(index, 1, column);
    }
  });
  updateSheet(getTracker(), currentSheet);
}

function deleteColumn(id) {
  const currentSheet = getCurrentSheet();
  currentSheet.columns = currentSheet.columns.filter((column) => {
    return column.id !== id;
  });
  updateSheet(getTracker(), currentSheet);
}

function updateSheetProp(key, value) {
  const currentSheet = getCurrentSheet();
  if (
    currentSheet.hasOwnProperty(key) &&
    key !== "id" &&
    key !== "new_col_id"
  ) {
    currentSheet[key] = value;
  }
  updateSheet(getTracker(), currentSheet);
}

function updateUI() {
  //Add button to sheet list for each sheet
  //Add current sheet info to UI params
  //Add current sheet columns to UI
}

// To init app, run getCurrentSheet(), and load it into the UI.
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

paramsInterval.addEventListener("input", (e) => {
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
  const currentSheet = getCurrentSheet();
  currentSheet.interval = e.value;
  updateSheet(getTracker(), currentSheet);
});

applyOthersBtn.querySelector("click", () => {
  if (paramsOtherInterval.value.trim().length > 0) {
    document.querySelectorAll(".data-col").forEach((column) => {
      column.querySelector(".data-col-interval").innerText =
        paramsInterval.value;
    });
    const sheet = getCurrentSheet();
    sheet.interval = paramsInterval.value;
    updateSheet(getTracker(), sheet);
    // Save "applied" boolean (or update DataColumn HTML template, and all existing DataColumns)
  }
});

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

// Popup visuals
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
    deleteColumn(deleteId);

    sheetContainer.querySelectorAll(".data-col").forEach((column) => {
      sheetContainer.removeChild(column);
    });
    loadAllColumns();
  }
}

function createColumn() {
  const allColumns = document.querySelectorAll(".data-col");
  if (allColumns.length >= 30) {
    displayPopup(columnLimitPopup, true);
  } else {
    addColumn();
    const newColumn = getCurrentSheet().columns[
      getCurrentSheet().columns.length - 1
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
  const sheetInterval =
    getCurrentSheet().interval.split("")[0].toUpperCase() +
    getCurrentSheet()
      .interval.split("")
      .slice(1, getCurrentSheet().interval.length)
      .join("");
  console.log(column.comments);
  console.log(column.comments.length);
  newColumn.id = `data-col-${column.id}`;
  newColumn.className = "data-col";
  newColumn.innerHTML = `<div class="data-col-bar">
                              <h3>
                                <i class="fas fa-times data-col-btn delete"></i>
                              </h3>
                            </div>
                            <div class="data-col-bar title-bar">
                              <h3 class="data-col-interval">
                                ${sheetInterval}&nbsp;<span class="data-col-count">
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
    updateColumnProp(column.id, "result", e.target.value);
  });
  newColumn
    .querySelector(".data-col-comments")
    .addEventListener("input", (e) => {
      updateColumnProp(column.id, "comments", e.target.value);
    });
  allLoadedColumns.forEach((column) => {
    column.querySelector(".data-col-btn.add").style.visibility = "hidden";
  });
  sheetContainer.appendChild(newColumn);
}

// Load columns from "API"
function loadAllColumns() {
  const currentSheet = getCurrentSheet();
  currentSheet.columns.forEach((column) => {
    loadColumn(column);
  });
}

//Init app
loadAllColumns();
