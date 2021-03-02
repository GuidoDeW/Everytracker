// Either pull an existing tracker from LS (the mock API) or create a new Object literal
// Consider whether this variable only serves as an initial model, or will in fact be constantly
// updated as the user interacts with the interface.
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
  currentSheet.columns.splice(currentSheet.columns.indexOf(column), 1, column);
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
