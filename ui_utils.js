import { getCurrentSheet, setCurrentSheet } from "./classes.js";

export function capitalize(str) {
  return str.length > 0
    ? `${
        str.trim().split("")[0].toUpperCase() +
        `${
          str.trim().length > 1
            ? str.split("").slice(1, str.length).join("")
            : ""
        }`
      }`
    : "";
}

export function applyInputStyle(element) {
  element.classList.add("text-ac");
  element.classList.add("fontw-700");
}

export function removeInputStyle(element, placeholder) {
  element.classList.remove("text-ac");
  element.classList.remove("fontw-700");
  element.placeholder = placeholder;
}

export function createColumnElement(id, interval, number, result, comments) {
  const newColumn = document.createElement("div");
  newColumn.id = `data-col-${id}`;
  newColumn.className = "data-col";
  newColumn.innerHTML = `<div class="data-col-bar">
                              <h3>
                                <i class="fas fa-times data-col-btn delete"></i>
                              </h3>
                            </div>
                            <div class="data-col-bar title-bar">
                              <h3 class="data-col-interval-text">
                                <span class="data-col-interval">${interval}</span>&nbsp;<span class="data-col-count">
                                ${number}
                                </span>
                              </h3>
                              <h3>
                                <i class="fas fa-plus-square data-col-btn add"></i>
                              </h3>
                            </div>
                            <label for="result">Result</label>
                            <input name="result" type="number" class="data-col-result input-rounded" value="${
                              result.length > 0 ? result : ""
                            }"/>
                            <p>Comments</p>
                            <textarea
                              name="comments"
                              cols="30"
                              rows="5"
                              class="data-col-comments input-rounded"
                            >${comments.length > 0 ? comments : ""}</textarea>`;
  return newColumn;
}

export function createSheetBtnEl(sheet, func) {
  const sheetBtn = document.createElement("button");
  const newSheetId = sheet.id;
  sheetBtn.id = `sheet-btn-${newSheetId}`;
  sheetBtn.className =
    "sheet-btn btn btn-s btn-default half-width sheet-link mt-1";
  sheetBtn.innerText = sheet.title.length > 0 ? sheet.title : "Sheet";
  sheetBtn.addEventListener("click", () => {
    setCurrentSheet(newSheetId);
    func();
  });
  return sheetBtn;
}

export function updateChartTitle(title, quantity, interval) {
  document.getElementById("chart-title").innerText = `${
    title.length > 0 ? capitalize(title) : `Results`
  } per ${quantity > 1 ? quantity : ""} ${
    quantity > 1 ? `${interval}s` : interval
  }`;
}

export function highlightCurrentBtn() {
  document.querySelectorAll(".sheet-btn").forEach((btn) => {
    Number(btn.id.replace("sheet-btn-", "")) == getCurrentSheet().id
      ? btn.classList.add("current")
      : btn.classList.remove("current");
  });
}
