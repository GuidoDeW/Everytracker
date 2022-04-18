import * as Store from "./classes.js";
import * as UI from "./ui_utils.js";
import * as deleteState from "./delete_state.js";
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
  paramsContainer = document.getElementById("params-container"),
  paramsTitle = document.getElementById("params-title"),
  paramsQuantity = document.getElementById("params-quantity"),
  paramsInterval = document.getElementById("params-interval"),
  intervalMenu = document.getElementById("interval-menu"),
  intervalOptions = document.querySelectorAll(".interval-option"),
  intervalLabel = document.getElementById("interval-label"),
  paramsCustomInterval = document.getElementById("params-custom-interval"),
  defaultInputFields = [
    paramsTitle,
    paramsQuantity,
    paramsInterval,
    paramsCustomInterval,
  ],
  allParamsOthers = document.querySelectorAll(".params-custom"),
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

function checkEnterKey(e) {
  return e.key == "Enter" || e.keyCode == 13;
}

function checkEscapeKey(e) {
  return e.key == "Escape" || e.keyCode == 27;
}

function toggleInputStyle(e) {
  if (
    e.target !== paramsTitle ||
    (e.target === paramsTitle && checkEnterKey(e))
  ) {
    paramsTitle.value.trim().length == 0
      ? UI.removeInputStyle(paramsTitle, "What do you want to track?")
      : UI.applyInputStyle(paramsTitle);
  }
}

function toggleStyleClass(element, styleClass, bool) {
  bool
    ? element.classList.add(styleClass)
    : element.classList.remove(styleClass);
}

function closeSlidingMenu(duration) {
  slidingMenu.style.transitionDuration = duration
    ? `${duration}s`
    : "var(--intermediate-transform)";
  toggleStyleClass(slidingMenu, "closed", true);
}

openMenuBtn.addEventListener("click", () => {
  slidingMenu.style.transitionDuration = "var(--intermediate-transform)";
  toggleStyleClass(
    slidingMenu,
    "closed",
    slidingMenu.classList.contains("closed") &&
      [...document.querySelectorAll(".popup")].filter((popup) => {
        return popup.classList.contains("current-popup");
      }).length != 0
      ? true
      : false
  );
});

closeMenuBtn.addEventListener("click", closeSlidingMenu);

function applyOtherInterval() {
  if (paramsCustomInterval.value.trim().length > 0) {
    const otherIntervalCapitalized = UI.capitalize(paramsCustomInterval.value);
    document.querySelectorAll(".data-col").forEach((column) => {
      column.querySelector(".data-col-interval").innerText =
        otherIntervalCapitalized;
    });
    const currentSheet = Store.getCurrentSheet();
    currentSheet.interval = paramsCustomInterval.value;
    currentSheet.interval_index = 6;
    UI.updateChartTitle(
      currentSheet.title,
      currentSheet.quantity,
      currentSheet.interval
    );
    Store.updateSheet(currentSheet);
  }
}

function checkMenuOverlap(element) {
  toggleStyleClass(
    slidingMenu,
    "hidden",
    slidingMenu.getBoundingClientRect().right >
      element.getBoundingClientRect().left
      ? true
      : false
  );
}

defaultInputFields.forEach((field) => {
  field.addEventListener("keydown", (e) => {
    if (checkEnterKey(e)) {
      defaultInputFields.indexOf(e.target) < defaultInputFields.length - 1
        ? defaultInputFields[defaultInputFields.indexOf(e.target) + 1].focus()
        : e.target.blur();
    }
  });
  field.addEventListener("focus", (e) => {
    checkMenuOverlap(e.target);
  });
});

document.addEventListener("click", (e) => {
  if (
    !(
      defaultInputFields.includes(e.target) ||
      e.target.classList.contains("data-col-result") ||
      e.target.classList.contains("data-col-comments") ||
      document.querySelector(".current-popup")
    )
  )
    toggleStyleClass(slidingMenu, "hidden", false);
});

openChartBtn.addEventListener("click", () => {
  if (chartState.isDrawn()) drawChart(canvas);
  const originalChartStyle =
    getComputedStyle(chartContainer).transitionTimingFunction;
  const originalMenuStyle =
    getComputedStyle(slidingMenu).transitionTimingFunction;
  chartContainer.style.transitionTimingFunction = "linear";
  slidingMenu.style.transitionTimingFunction = "linear";
  const animationTime = Number(
    getComputedStyle(chartContainer).transitionDuration.slice(0, -1)
  );

  const windowWidth = window.innerWidth;
  const menuWidth = slidingMenu.getBoundingClientRect().width;

  const delay =
    ((windowWidth - menuWidth) / windowWidth) * animationTime * 1000;

  const closeDuration = (menuWidth / windowWidth) * animationTime;
  toggleStyleClass(chartContainer, "closed", false);
  setTimeout(() => {
    closeSlidingMenu(closeDuration);
  }, delay);

  setTimeout(() => {
    chartContainer.style.transitionTimingFunction = originalChartStyle;
    slidingMenu.style.transitionTimingFunction = originalMenuStyle;
  }, animationTime * 1000);
});

hideChartBtn.addEventListener("click", () => {
  toggleStyleClass(chartContainer, "closed", true);
});

paramsTitle.addEventListener("focus", (e) => {
  UI.removeInputStyle(e.target, "");
});

document.addEventListener("click", toggleInputStyle);

paramsTitle.addEventListener("keydown", toggleInputStyle);

paramsTitle.addEventListener("input", (e) => {
  if (e.target.value.length > 15)
    e.target.value = e.target.value.substring(0, 15);
  const currentSheet = Store.getCurrentSheet();
  const newTitle =
    e.target.value.trim().length > 0 ? UI.capitalize(e.target.value) : "";
  currentSheet.title = newTitle;
  UI.updateChartTitle(newTitle, currentSheet.quantity, currentSheet.interval);
  document.getElementById(`sheet-btn-${currentSheet.id}`).innerText =
    newTitle.length > 0 ? newTitle : "Sheet";
  Store.updateSheet(currentSheet);
});

function switchOtherParams(bool) {
  if (bool) {
    allParamsOthers.forEach((param) => {
      toggleStyleClass(param, "disabled", false);
      param.removeAttribute("disabled");
    });
    toggleStyleClass(intervalLabel, "disabled", true);
  } else {
    allParamsOthers.forEach((param) => {
      toggleStyleClass(param, "disabled", true);
      param.setAttribute("disabled", "true");
    });
    toggleStyleClass(intervalLabel, "disabled", false);
  }
  paramsCustomInterval.value = "";
}

paramsQuantity.addEventListener("input", (e) => {
  const currentSheet = Store.getCurrentSheet();
  if (e.target.value.trim().length > 0 && Number(e.target.value) <= 0)
    e.target.value = 1;
  if (e.target.value.trim().length > 0 && Number(e.target.value) > 100000)
    e.target.value = 100000;
  currentSheet.quantity =
    e.target.value.trim().length == 0 ? 1 : e.target.value;
  UI.updateChartTitle(
    currentSheet.title,
    e.target.value,
    currentSheet.interval
  );
  Store.updateSheet(currentSheet);
  document.addEventListener(
    "click",
    (e) => {
      if (
        e.target !== paramsQuantity &&
        paramsQuantity.value.trim().length == 0
      )
        paramsQuantity.value = "1";
    },
    { once: true }
  );
});

paramsInterval.addEventListener("click", () => {
  displayPopup(intervalMenu, false, false);
});

document.addEventListener("click", (e) => {
  if (
    intervalMenu.classList.contains("current-popup") &&
    e.target !== paramsInterval
  )
    hidePopup();
});

document.addEventListener("scroll", () => {
  if (intervalMenu.classList.contains("current-popup")) {
    if (paramsInterval.getBoundingClientRect().bottom <= 0) hidePopup();
  }
});

intervalOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const optionIndex = [...intervalOptions].indexOf(option);
    const newText = option.innerText;
    paramsInterval.innerText = newText;
    if (optionIndex < 6) {
      switchOtherParams(false);
      const currentSheet = Store.getCurrentSheet();
      currentSheet.interval = newText;
      currentSheet.interval_index = optionIndex;
      Store.updateSheet(currentSheet);
      UI.updateChartTitle(
        currentSheet.title,
        currentSheet.quantity,
        currentSheet.interval
      );
      sheetContainer.querySelectorAll(".data-col").forEach((column) => {
        column.querySelector(".data-col-interval").innerText =
          UI.capitalize(newText);
      });
    } else {
      switchOtherParams(true);
      paramsCustomInterval.focus();
    }
  });
});

applyOthersBtn.addEventListener("click", applyOtherInterval);

paramsCustomInterval.addEventListener("keydown", (e) => {
  if (checkEnterKey(e)) applyOtherInterval();
});

paramsCustomInterval.addEventListener("input", (e) => {
  if (e.target.value.length > 20) {
    e.target.value = e.target.value.substring(0, 20);
  }
});

function toggleBtnFunctions(bool) {
  [slidingMenu, paramsContainer, sheetContainer, chartContainer].forEach(
    (item) => {
      item.style.pointerEvents = bool ? "all" : "none";
    }
  );
}

function displayPopup(popup, sheet, max) {
  toggleBtnFunctions(false);
  toggleStyleClass(popup, "current-popup", true);
  if (popup === limitPopup) {
    if (sheet) {
      limitPopup.querySelector("p").innerText = max
        ? "You can save a maximum of 60 data sheets."
        : "The minimal number of sheets is 1.";
    } else {
      limitPopup.querySelector("p").innerText = max
        ? "You can track a maximum of 30 intervals per data sheet."
        : "Your data sheet must contain at least one column.";
    }
  }
  toggleStyleClass(popup, "closed", false);
  checkMenuOverlap(popup);
}

function hidePopup() {
  document.querySelectorAll(".popup").forEach((popup) => {
    popup.classList.remove("current-popup");
    if (!popup.classList.contains("closed"))
      toggleStyleClass(popup, "closed", true);
  });
  toggleStyleClass(slidingMenu, "hidden", false);
  toggleBtnFunctions(true);
}

document.querySelectorAll(".popup-warning").forEach((popup) => {
  popup.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", hidePopup);
    if (popup == confirmDeletePopup && btn !== confirmDeleteBtn)
      btn.addEventListener("click", deleteState.setDeleteColumnId);
    if (popup == confirmSheetDeletePopup && btn !== confirmSheetDeleteBtn)
      btn.addEventListener("click", deleteState.setDeleteSheetId);
  });
});

confirmDeleteBtn.addEventListener("click", removeColumn);
confirmSheetDeleteBtn.addEventListener("click", removeSheet);

document.addEventListener("keydown", (e) => {
  if (checkEnterKey(e) || checkEscapeKey(e)) {
    if (checkEscapeKey(e)) {
      deleteState.setDeleteColumnId();
      deleteState.setDeleteSheetId();
    } else {
      if (confirmDeletePopup.classList.contains("current-popup")) {
        removeColumn();
      } else if (confirmSheetDeletePopup.classList.contains("current-popup"))
        removeSheet();
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (checkEnterKey(e) || checkEscapeKey(e)) hidePopup();
});

document.addEventListener("touchend", (e) => {
  if (document.querySelector(".current-popup")) {
    const touchX = e.changedTouches[0].clientX;
    const touchY = e.changedTouches[0].clientY;
    const popupRect = document
      .querySelector(".current-popup")
      .getBoundingClientRect();
    if (
      touchY < popupRect.top ||
      touchX > popupRect.right ||
      touchY > popupRect.bottom ||
      touchX < popupRect.left
    ) {
      e.preventDefault();
      deleteState.setDeleteColumnId();
      deleteState.setDeleteSheetId();
      hidePopup();
    }
  }
});

function removeSheet() {
  const deleteId = deleteState.getDeleteSheetId();
  Store.deleteSheet(deleteId);
  sheetList.removeChild(document.getElementById(`sheet-btn-${deleteId}`));
  loadCurrentSheet();
  deleteState.setDeleteSheetId();
}

function removeColumn() {
  Store.deleteColumn(deleteState.getDeleteColumnId());
  sheetContainer.querySelectorAll(".data-col").forEach((column) => {
    sheetContainer.removeChild(column);
  });
  loadAllColumns(Store.getCurrentSheet());
  deleteState.setDeleteColumnId();
}

function createColumn() {
  const allColumns = document.querySelectorAll(".data-col");
  if (allColumns.length >= 31) {
    displayPopup(limitPopup, false, true);
  } else {
    Store.addColumn();
    const currentSheetColumns = Store.getCurrentSheet().columns;
    const newColumn = currentSheetColumns[currentSheetColumns.length - 1];
    allColumns.forEach((item) => {
      toggleStyleClass(item, "newest", false);
      item.querySelector(".data-col-btn.add").style.visibility = "hidden";
    });

    loadColumn(newColumn);
    const latestColumn =
      sheetContainer.querySelectorAll(".data-col")[
        sheetContainer.querySelectorAll(".data-col").length - 1
      ];
    toggleStyleClass(latestColumn, "newest", true);

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

  const colResult = newColumn.querySelector(".data-col-result");
  const colComments = newColumn.querySelector(".data-col-comments");

  colResult.addEventListener("input", (e) => {
    if (Number(e.target.value) >= 1000000000) e.target.value = 1000000000;
    if (Number(e.target.value) < 0) e.target.value = 0;
    Store.updateColumnProp(column.id, "result", e.target.value);
  });

  colResult.addEventListener("keydown", (e) => {
    if (checkEnterKey(e)) {
      e.preventDefault();
      colComments.focus();
    }
  });

  newColumn
    .querySelector(".data-col-btn.delete")
    .addEventListener("click", () => {
      if (Store.getCurrentSheet().columns.length > 1) {
        deleteState.setDeleteColumnId(column.id);
        newColumn.querySelector(".data-col-result").value.trim() !== "" ||
        newColumn.querySelector(".data-col-comments").value.trim() !== ""
          ? displayPopup(confirmDeletePopup, false, false)
          : removeColumn();
      } else {
        displayPopup(limitPopup, false, false);
      }
    });

  newColumn
    .querySelector(".data-col-btn.add")
    .addEventListener("click", createColumn);
  colComments.addEventListener("input", (e) => {
    e.target.value.length >= 120
      ? (e.target.value = e.target.value.slice(0, 120))
      : Store.updateColumnProp(column.id, "comments", e.target.value);
  });

  [colResult, colComments].forEach((field) => {
    field.addEventListener("focus", (e) => {
      checkMenuOverlap(e.target);
    });
  });

  allLoadedColumns.forEach((column) => {
    column.querySelector(".data-col-btn.add").style.visibility = "hidden";
  });

  sheetContainer.appendChild(newColumn);
}

function loadAllColumns(sheet) {
  sheetContainer.querySelectorAll(".data-col").forEach((column) => {
    sheetContainer.removeChild(column);
  });
  sheet.columns.forEach((column) => {
    loadColumn(column);
  });
}

function loadCurrentSheet() {
  const currentSheet = Store.getCurrentSheet();
  const sheetTitle = currentSheet.title;
  paramsTitle.value = sheetTitle;
  paramsInterval.innerText = currentSheet.interval;
  if (currentSheet.title.length > 0) UI.applyInputStyle(paramsTitle);

  paramsQuantity.value = currentSheet.quantity;
  paramsInterval.selectedIndex = currentSheet.interval_index;
  if (currentSheet.interval_index == 6) {
    switchOtherParams(true);
    paramsCustomInterval.value = currentSheet.interval;
  } else {
    switchOtherParams(false);
  }
  if (chartState.isDrawn()) resetChart();
  loadAllColumns(currentSheet);
  UI.highlightCurrentBtn();
  UI.updateChartTitle(sheetTitle, currentSheet.quantity, currentSheet.interval);
}

function loadMenu() {
  Store.getTracker().sheets.forEach((sheet) => {
    sheetList.appendChild(UI.createSheetBtnEl(sheet, loadCurrentSheet));
  });
  UI.highlightCurrentBtn();
}

newSheetBtn.addEventListener("click", () => {
  if (Store.getTracker().sheets.length <= 60) {
    Store.addSheet();
    sheetList.appendChild(
      UI.createSheetBtnEl(Store.getCurrentSheet(), loadCurrentSheet)
    );
    loadCurrentSheet();
    resetChart();
  } else {
    displayPopup(limitPopup, true, true);
  }
});

deleteSheetBtn.addEventListener("click", () => {
  if (Store.getTracker().sheets.length <= 1) {
    displayPopup(limitPopup, true, false);
  } else {
    deleteState.setDeleteSheetId(Store.getCurrentSheet().id);
    displayPopup(confirmSheetDeletePopup, true);
  }
});

window.addEventListener("resize", () => {
  if (document.querySelector(".current-popup"))
    checkMenuOverlap(document.querySelector(".current-popup"));
  if (chartState.isDrawn()) drawChart(canvas);
});

function resetChart() {
  chartState.setDrawn(false);
  clearChart(canvasContext);
}

clearChartBtn.addEventListener("click", resetChart);

function drawChartType(bars, lines) {
  chartState.setBars(bars);
  chartState.setLines(lines);
  drawChart(canvas);
}

barChartBtn.addEventListener("click", () => {
  drawChartType(true, false);
});

lineChartBtn.addEventListener("click", () => {
  drawChartType(false, true);
});

mixedChartBtn.addEventListener("click", () => {
  drawChartType(true, true);
});

loadCurrentSheet();
loadMenu();
