export class Tracker {
  constructor() {
    this.new_sheet_id = 2;
    this.current_sheet_id = 1;
    //Consider if this is necessary (benefit: save configuration for new sheets)
    this.last_title = "";
    this.last_quantity = 1;
    this.last_interval_index = 2;
    this.last_interval = "day";
    this.sheets = [
      new DataSheet(
        1,
        this.last_title,
        this.last_quantity,
        this.last_interval_index,
        this.last_interval
      ),
    ];
  }
}

export class DataSheet {
  // Create DataSheet with new DataSheet(new_sheet_id), and update new_sheet_id in "API" function.
  constructor(id, title, quantity, interval_index, interval) {
    this.id = id;
    this.new_col_id = 2;
    this.columns = [new DataColumn(this.id, 1)];
    this.title = title;
    this.quantity = quantity;
    this.interval_index = interval_index;
    this.interval = interval;
  }
}

export class DataColumn {
  constructor(sheet_id, id) {
    this.sheet_id = sheet_id;
    this.id = id;
    this.result = "";
    this.comments = "";
  }
}

export function getTracker() {
  return localStorage.getItem("everytracker")
    ? JSON.parse(localStorage.getItem("everytracker"))
    : new Tracker();
}

// Consider if passing the updated sheet to this function as a second parameter
// would decrease the net number of "requests" to the mock API
export function updateTracker(tracker) {
  localStorage.setItem("everytracker", JSON.stringify(tracker));
}

export function setCurrentSheet(id) {
  const tracker = getTracker();
  if (
    tracker.sheets.filter((sheet) => {
      return sheet.id === id;
    }).length > 0
  ) {
    tracker.current_sheet_id = id;
    updateTracker(tracker);
  }
}

export function getCurrentSheet() {
  const tracker = getTracker();
  return tracker.sheets.filter((sheet) => {
    return sheet.id === tracker.current_sheet_id;
  })[0];
}

export function addSheet() {
  const tracker = getTracker();
  const newSheet = new DataSheet(
    tracker.new_sheet_id,
    tracker.last_title,
    tracker.last_quantity,
    tracker.last_interval_index,
    tracker.last_interval
  );
  tracker.sheets.push(newSheet);
  tracker.current_sheet_id = newSheet.id;
  tracker.new_sheet_id++;
  updateTracker(tracker);
}

export function updateSheet(tracker, sheet) {
  //Replace old sheet with updated version
  tracker.sheets = tracker.sheets.map((item) => {
    return item.id == sheet.id ? sheet : item;
  });
  //Update tracker props for new sheet according to current sheet param updates (if any)
  //Condition to safeguard against updates to sheets other than the current sheet
  //affecting new sheet parameters (less expensive than calling getCurrentSheet())
  if (sheet.id == tracker.current_sheet_id) {
    tracker.last_title = sheet.title;
    tracker.last_quantity = sheet.quantity;
    tracker.last_interval = sheet.interval;
    tracker.last_interval_index = sheet.interval_index;
  }
  updateTracker(tracker);
}

export function deleteSheet(id) {
  const tracker = getTracker();
  const deleteIndex = tracker.sheets.findIndex((sheet) => {
    return sheet.id === id;
  });
  console.log(
    `Id of the sheet to be deleted: ${id}. Found deleteIndex: ${deleteIndex}.`
  );
  console.log(deleteIndex);

  tracker.current_sheet_id =
    deleteIndex > 0
      ? tracker.sheets[deleteIndex - 1].id
      : tracker.sheets[deleteIndex + 1].id;
  tracker.sheets.splice(deleteIndex, 1);
  console.log(tracker.current_sheet_id);
  updateTracker(tracker);
}

export function addColumn() {
  const currentSheet = getCurrentSheet();
  const newColumn = new DataColumn(currentSheet.id, currentSheet.new_col_id);
  currentSheet.columns.push(newColumn);
  currentSheet.new_col_id++;
  updateSheet(getTracker(), currentSheet);
}

export function getColumn(id) {
  return getCurrentSheet().columns.filter((column) => {
    return column.id === id;
  })[0];
}

export function updateColumnProp(id, key, value) {
  const column = getColumn(id);
  if (column.hasOwnProperty(key) && key !== "sheet_id" && key !== "id") {
    column[key] = value;
  }
  updateColumn(column);
}

export function updateColumn(column) {
  const currentSheet = getCurrentSheet();
  currentSheet.columns.forEach((item, index) => {
    if (item.id === column.id) {
      currentSheet.columns.splice(index, 1, column);
    }
  });
  updateSheet(getTracker(), currentSheet);
}

export function deleteColumn(id) {
  const currentSheet = getCurrentSheet();
  currentSheet.columns = currentSheet.columns.filter((column) => {
    return column.id !== id;
  });
  updateSheet(getTracker(), currentSheet);
}

export function updateSheetProp(key, value) {
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

export function getAllResults() {
  return getCurrentSheet().columns.map((column) => {
    return Number(column.result);
  });
}
