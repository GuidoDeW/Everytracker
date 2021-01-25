// Either pull an existing tracker from LS (the mock API) or create a new Object literal
// Consider whether this variable only serves as an initial model, or will in fact be constantly
// updated as the user interacts with the interface.

class DataSheet {
  // Create DataSheet with new DataSheet(new_sheet_id), and update new_sheet_id in "API" function.
  constructor(id) {
    this.id = id;
    this.new_col_id = 2;
    this.columns = [new DataColumn(this.id, 1)];
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
    : {
        new_sheet_id: 1,
        current_sheet_id: 1,
        sheets: [],
      };
}

function setTracker(item) {
  localStorage.setItem("everytracker", JSON.stringify(item));
}

function addSheet() {
  const tracker = getTracker();
  const newSheet = new DataSheet(tracker.new_sheet_id);
  tracker.sheets.push(newSheet);
  tracker.current_sheet_id = newSheet.id;
  tracker.new_sheet_id++;
  setTracker(tracker);
}

function addColumn() {
  const tracker = getTracker();
  const currentSheet = tracker.sheets.filter((sheet) => {
    return sheet.id === tracker.current_sheet_id;
  })[0];
  const newColumn = new DataColumn(currentSheet.id, currentSheet.new_col_id);
  currentSheet.columns.push(newColumn);
  currentSheet.new_col_id++;
  tracker.sheets[tracker.sheets.indexOf(currentSheet)] = currentSheet;
  setTracker(tracker);
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
//You could simply replace the sheet id with its index (since sheets are not as haphazardly added and removed as datacolumns),
// but this would a full re-indexation when a sheet is removed
