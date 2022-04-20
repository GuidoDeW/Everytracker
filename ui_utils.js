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

export function toggleStyleClass(element, styleClass, bool) {
  bool
    ? element.classList.add(styleClass)
    : element.classList.remove(styleClass);
}

export function applyInputStyle(element) {
  toggleStyleClass(element, "text-ac", true);
  toggleStyleClass(element, "fontw-700", true);
  element.value = capitalize(element.value);
}

export function removeInputStyle(element, dummyText) {
  toggleStyleClass(element, "text-ac", false);
  toggleStyleClass(element, "fontw-700", false);
  element.placeholder = dummyText;
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
                            <input name="result" type="number" class="data-col-result input-rounded px-h" value="${
                              result.length > 0 ? result : ""
                            }"/>
                            <p>Comments</p>
                            <textarea
                              name="comments"
                              cols="30"
                              rows="5"
                              maxlength="120"
                              class="data-col-comments input-rounded px-h py-h"
                            >${comments.length > 0 ? comments : ""}</textarea>`;
  return newColumn;
}

export function createSheetBtnEl(sheet, func) {
  const sheetBtn = document.createElement("button");
  const newSheetId = sheet.id;
  sheetBtn.id = `sheet-btn-${newSheetId}`;
  sheetBtn.className = "sheet-btn btn btn-s btn-default sheet-link mt-1";
  sheetBtn.innerText = sheet.title.length > 0 ? sheet.title : "Sheet";
  sheetBtn.addEventListener("click", () => {
    setCurrentSheet(newSheetId);
    func();
  });
  return sheetBtn;
}

export function updateChartTitle(title, quantity, interval) {
  document.getElementById("chart-title").innerText = `${
    title.length > 0 ? title : `Results`
  } per ${quantity > 1 ? quantity : ""} ${
    quantity > 1 ? `${interval}s` : interval
  }`;
}

export function highlightCurrentBtn() {
  document.querySelectorAll(".sheet-btn").forEach((btn) => {
    Number(btn.id.replace("sheet-btn-", "")) == getCurrentSheet().id
      ? toggleStyleClass(btn, "current", true)
      : toggleStyleClass(btn, "current", false);
  });
}
