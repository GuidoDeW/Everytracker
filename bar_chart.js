import { unBlur, clearChart, createGrid, styleNumber } from "./chart_utils.js";

export default function drawBars(canvas, results, font) {
  unBlur(canvas);
  clearChart(canvas);
  const canvasContext = canvas.getContext("2d");
  const zeroY = canvasContext.canvas.height;

  const viewportWidth = document.body.clientWidth;

  const widthDenominator =
    viewportWidth < 768 ? results.length : results.length + 1;

  let barWidth;

  if (viewportWidth <= 568) {
    barWidth =
      results.length <= 10
        ? canvasContext.canvas.width / 10
        : canvasContext.canvas.width / widthDenominator;
  } else if (viewportWidth <= 1200) {
    barWidth =
      results.length <= 15
        ? canvasContext.canvas.width / 15
        : canvasContext.canvas.width / widthDenominator;
  } else {
    barWidth =
      results.length <= 20 ? 50 : canvasContext.canvas.width / widthDenominator;
  }

  let highestValue = results[0];

  results.forEach((result) => {
    if (result > highestValue) {
      highestValue = result;
    }
  });

  let mostDigits = 0;
  const legendNums = [];

  for (let i = 0; i <= 10; i++) {
    const numText = styleNumber(Math.round((highestValue / 10) * i));
    if (numText.length > mostDigits) {
      mostDigits = numText.length;
    }
    legendNums.push(numText);
  }

  canvasContext.font = `${viewportWidth <= 1200 ? 10 : 12}px ${font}`;

  for (let j = 0; j <= 10; j++) {
    const drawY = zeroY - ((zeroY * 0.9) / 10) * j;
    canvasContext.strokeStyle = "rgb(0, 0, 0, 0.5)";

    if (viewportWidth >= 768) {
      const spaces = " ".repeat(mostDigits - legendNums[j].length);
      canvasContext.strokeText(`${spaces + legendNums[j]}`, 0, drawY);
    }

    const stroke = j == 10 ? true : false;
    createGrid(canvas, canvasContext.strokeStyle, 0, drawY, stroke);
  }

  canvasContext.fillStyle = "rgba(100, 100, 255, 0.8)";
  canvasContext.strokeStyle = "rgb(100, 255, 235)";

  for (let k = 0; k < results.length; k++) {
    const resultValue = results[k];
    const barHeight = (resultValue / highestValue) * zeroY * 0.9;
    const barX = viewportWidth >= 768 ? (k + 1) * barWidth : k * barWidth;
    const inverseY = zeroY - barHeight;
    canvasContext.fillRect(barX, inverseY, barWidth, barHeight);
    canvasContext.strokeRect(barX, inverseY, barWidth, barHeight);
  }
}
