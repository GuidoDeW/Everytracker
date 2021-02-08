import { clearChart, setGrid } from "./chart_utils.js";

export default function drawBars(canvas, results) {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const canvasContext = canvas.getContext("2d");
  clearChart(canvas);

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

  canvasContext.font = `${viewportWidth <= 1200 ? 10 : 12}px Arial`;

  const mostDigits = Math.round(highestValue).toString().length;

  for (let i = 0; i <= 10; i++) {
    const drawY = zeroY - ((zeroY * 0.9) / 10) * i;
    const stroke = i == 10 ? true : false;
    let textSpace = 0;
    if (viewportWidth >= 768) {
      const barInterval = Math.round(highestValue / 10) * i;
      const spaces = " ".repeat(mostDigits - barInterval.toString().length);
      canvasContext.strokeStyle = "rgb(0, 0, 0)";
      canvasContext.strokeText(`${spaces + barInterval}`, 0, drawY);
      textSpace = barWidth;
    }

    setGrid(canvas, textSpace, drawY, stroke);
  }

  canvasContext.fillStyle = "rgba(100, 100, 255, 0.8)";
  canvasContext.strokeStyle = "rgb(100, 255, 235)";
  //Number-popup related

  for (let j = 0; j < results.length; j++) {
    const resultValue = results[j];
    const barHeight = (resultValue / highestValue) * zeroY * 0.9;
    const barX = viewportWidth >= 768 ? (j + 1) * barWidth : j * barWidth;
    const inverseY = zeroY - barHeight;
    canvasContext.fillRect(barX, inverseY, barWidth, barHeight);
    canvasContext.strokeRect(barX, inverseY, barWidth, barHeight);
  }
}
