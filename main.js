//To do:
// -decide whether to automatically redraw charts on sheets that were left with rendered charts, or to
//have the user manually request a re-render any time they switch between sheets.
//-Make chart collapsible (similar to the menu bar) and add draw and wipe buttons
//- Redraw chart (IF chart render has been requested by user) on window resize! (/On window move?)

//Get font from css, and pass down to chart state. Remove font as an argument from chart drawing function,
//and instead get the font directly from the chart state module.

//Consider using requestAnimationFrame (which can probably check for overlap between different DOM
// elements, and adjust the next animation frame based on that input)
import * as Store from "./classes.js";
import * as UI from "./ui_utils.js";
import * as chartState from "./chart_state.js";
import { clearChart } from "./chart_utils.js";
import drawChart from "./charts.js";

const slidingMenu = document.getElementById("sliding-menu"),
  openMenuBtn = document.getElementById("open-menu-btn"),
  closeMenuBtn = document.getElementById("close-menu-btn"),
  sheetList = document.getElementById("sheet-list"),
  newSheetBtn = document.getElementById("new-sheet-btn"),
  deleteSheetBtn = document.getElementById("delete-sheet-btn"),
  openChartBtn = document.getElementById("open-chart-btn"),
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
  limitPopup = document.getElementById("limit-popup"),
  confirmDeletePopup = document.getElementById("confirm-delete-popup"),
  confirmDeleteBtn = document.getElementById("confirm-delete-btn"),
  confirmSheetDeletePopup = document.getElementById(
    "confirm-sheet-delete-popup"
  ),
  confirmSheetDeleteBtn = document.getElementById("confirm-sheet-delete-btn"),
  chartContainer = document.getElementById("chart-container"),
  hideChartBtn = document.getElementById("hide-chart-btn"),
  clearChartBtn = document.getElementById("clear-chart-btn"),
  barChartBtn = document.getElementById("bar-chart-btn"),
  lineChartBtn = document.getElementById("line-chart-btn"),
  mixedChartBtn = document.getElementById("mixed-chart-btn"),
  canvas = document.getElementById("chart-canvas"),
  canvasContext = canvas.getContext("2d");

function toggleInputStyle(e) {
  if (
    e.target !== paramsTitle ||
    (e.target === paramsTitle &&
      e.type == "keydown" &&
      (e.key == "Enter" || e.keyCode == 13))
  ) {
    if (paramsTitle.value.trim().length == 0) {
      UI.removeInputStyle(paramsTitle, "What do you want to track?");
    } else {
      UI.applyInputStyle(paramsTitle);
    }
  }
}

function closeSlidingMenu() {
  slidingMenu.classList.add("closed");
}

function applyOtherInterval() {
  if (paramsOtherInterval.value.trim().length > 0) {
    const otherInterval = UI.capitalize(paramsOtherInterval.value);
    document.querySelectorAll(".data-col").forEach((column) => {
      column.querySelector(".data-col-interval").innerText = otherInterval;
    });
    const currentSheet = Store.getCurrentSheet();
    currentSheet.interval = otherInterval;
    currentSheet.interval_index = 6;
    Store.updateSheet(Store.getTracker(), currentSheet);
  }
}

defaultInputFields.forEach((field) => {
  field.addEventListener("keydown", (e) => {
    if (e.key == "Enter" || e.keyCode === 13) {
      defaultInputFields.indexOf(e.target) < defaultInputFields.length - 1
        ? defaultInputFields[defaultInputFields.indexOf(e.target) + 1].focus()
        : e.target.blur();
    }
  });
});

openMenuBtn.addEventListener("click", () => {
  slidingMenu.classList.toggle("closed");
});

closeMenuBtn.addEventListener("click", closeSlidingMenu);

openChartBtn.addEventListener("click", () => {
  if (
    getComputedStyle(chartContainer).transitionTimingFunction === "linear" &&
    getComputedStyle(slidingMenu).transitionTimingFunction === "linear"
  ) {
    const animationTime =
      Number(getComputedStyle(chartContainer).transitionDuration.slice(0, -1)) *
      1000;
    const delay =
      ((window.innerWidth - slidingMenu.getBoundingClientRect().width) /
        window.innerWidth) *
      animationTime;

    setTimeout(() => {
      closeSlidingMenu();
    }, delay);
  } else {
    closeSlidingMenu();
  }
  chartContainer.classList.remove("closed");
});

hideChartBtn.addEventListener("click", () => {
  chartContainer.classList.add("closed");
});

paramsTitle.addEventListener("focus", (e) => {
  UI.removeInputStyle(e.target, "");
});

document.addEventListener("click", toggleInputStyle);

paramsTitle.addEventListener("keydown", toggleInputStyle);

paramsTitle.addEventListener("input", (e) => {
  const currentSheet = Store.getCurrentSheet();
  const newTitle =
    e.target.value.trim().length > 0 ? UI.capitalize(e.target.value) : "";
  currentSheet.title = newTitle;
  document.getElementById(`sheet-btn-${currentSheet.id}`).innerText =
    e.target.value.length > 0 ? newTitle : "Sheet";
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
    const sheetInterval = UI.capitalize(paramsInterval.value);
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

function displayPopup(popup, sheet, max) {
  popup.classList.add("current-popup");
  if (popup === limitPopup) {
    if (sheet) {
      limitPopup.querySelector("p").innerText =
        "The minimal number of sheets is 1.";
    } else {
      limitPopup.querySelector("p").innerText = max
        ? "You can track a maximum of 30 intervals per data sheet."
        : "Your data sheet must contain at least one column.";
    }
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

function hidePopup() {
  document.querySelectorAll(".popup").forEach((popup) => {
    if (popup.classList.contains("current-popup")) {
      popup.style.transform = "translate(-1000%, -1000%)";
      popup.classList.remove("current-popup");
    }
  });
}

document.querySelectorAll(".popup").forEach((popup) => {
  popup.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", hidePopup);
  });
});

document.addEventListener("keydown", (e) => {
  if (
    (e.key == "Enter" || e.keyCode == 13) &&
    limitPopup.classList.contains("current-popup")
  ) {
    hidePopup();
  }
});

function removeColumn(column, bool) {
  if (document.querySelectorAll(".data-col").length === 1) {
    displayPopup(limitPopup, false, false);
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
          },
          { once: true }
        );
      }
    });
    displayPopup(confirmDeletePopup);
  } else {
    const deleteId = Number(column.id.replace("data-col-", ""));
    Store.deleteColumn(deleteId);

    sheetContainer.querySelectorAll(".data-col").forEach((column) => {
      sheetContainer.removeChild(column);
    });
    loadAllColumns();
  }
}

function createColumn() {
  const allColumns = document.querySelectorAll(".data-col");
  if (allColumns.length >= 30) {
    displayPopup(limitPopup, false, true);
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
  const allLoadedColumns = sheetContainer.querySelectorAll(".data-col");
  const newColumn = UI.createColumnElement(
    column.id,
    UI.capitalize(Store.getCurrentSheet().interval),
    allLoadedColumns.length + 1,
    column.result,
    column.comments
  );
  newColumn.querySelector(".data-col-result").addEventListener("input", (e) => {
    if (Number(e.target.value) >= 1000000000) e.target.value = 1000000000;
    if (Number(e.target.value) < 0) e.target.value = 0;
  });
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

function loadAllColumns() {
  const currentSheet = Store.getCurrentSheet();
  sheetContainer.querySelectorAll(".data-col").forEach((column) => {
    sheetContainer.removeChild(column);
  });
  currentSheet.columns.forEach((column) => {
    loadColumn(column);
  });
}

function loadCurrentSheet() {
  const currentSheet = Store.getCurrentSheet();
  paramsTitle.value = currentSheet.title;
  if (currentSheet.title.length > 0) {
    UI.applyInputStyle(paramsTitle);
  }
  paramsQuantity.value = currentSheet.quantity;
  paramsInterval.selectedIndex = currentSheet.interval_index;
  if (currentSheet.interval_index == 6) {
    switchOtherParams(true);
    paramsOtherInterval.value = currentSheet.interval;
  } else {
    switchOtherParams(false);
  }
  if (chartState.isDrawn()) clearChart(canvasContext);
  loadAllColumns();
  UI.highlightCurrentBtn();
  Store.updateSheet(Store.getTracker(), currentSheet);
}

function loadMenu() {
  Store.getTracker().sheets.forEach((sheet) => {
    sheetList.appendChild(UI.createSheetBtnEl(sheet, loadCurrentSheet));
  });
  UI.highlightCurrentBtn();
}

newSheetBtn.addEventListener("click", () => {
  Store.addSheet();
  sheetList.appendChild(
    UI.createSheetBtnEl(Store.getCurrentSheet(), loadCurrentSheet)
  );
  loadCurrentSheet();
  clearChart(canvasContext);
});

deleteSheetBtn.addEventListener("click", () => {
  Store.getTracker().sheets.length > 1
    ? displayPopup(confirmSheetDeletePopup, true)
    : displayPopup(limitPopup, true);
});

confirmSheetDeleteBtn.addEventListener("click", () => {
  const currentSheet = Store.getCurrentSheet();
  Store.deleteSheet(currentSheet.id);
  sheetList.removeChild(
    document.getElementById(`sheet-btn-${currentSheet.id}`)
  );
  loadCurrentSheet();
});

chartState.setFont(getComputedStyle(paramsTitle).fontFamily);

window.addEventListener("resize", () => {
  if (chartState.isDrawn()) drawChart(canvas, "Arial");
});

clearChartBtn.addEventListener("click", () => {
  chartState.setDrawn(false);
  clearChart(canvasContext);
});

barChartBtn.addEventListener("click", () => {
  chartState.setBars(true);
  chartState.setLines(false);
  drawChart(canvas, "Arial");
});

lineChartBtn.addEventListener("click", () => {
  chartState.setBars(false);
  chartState.setLines(true);
  drawChart(canvas, "Arial");
});

mixedChartBtn.addEventListener("click", () => {
  chartState.setBars(true);
  chartState.setLines(true);
  drawChart(canvas, "Arial");
});

loadCurrentSheet();
loadMenu();
