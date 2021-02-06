import * as Store from "./classes.js/";

export default function drawGraph(sheets) {
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

  // To draw the graph based on screen values instead of "API" values,
  // adapt the function to take in an array, and pass in
  // [...document.querySelectorAll(".data-col")].map(
  //   (column) => {
  //     return Number(column.querySelector(".data-col-result").value);
  //   }
  // as its argument.
  // Perhaps passing in the array as a parameter is the best option anyway,
  // as it would allow for using UI data for a single-sheet graph,
  // and for "API"-based plotting when comparing multiple sheets.
  const allResults = Array.from(Store.getCurrentSheet().columns).map(
    (column) => {
      return Number(column.result);
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
