let drawn = false;
let bars = false;
let lines = false;

export function setDrawn(bool) {
  drawn = bool;
}

export function setBars(bool) {
  bars = bool;
}

export function setLines(bool) {
  lines = bool;
}

export function isDrawn() {
  return drawn;
}

export function hasBars() {
  return bars;
}

export function hasLines() {
  return lines;
}
