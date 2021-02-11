import { unBlur, clearChart, createGrid, styleNumber } from "./chart_utils.js";

export default function drawChart(canvas, results, bars, lines, font) {
  unBlur(canvas);
  clearChart(canvas);
  const canvasContext = canvas.getContext("2d");
  const canvasHeight = canvasContext.canvas.height;
  const canvasWidth = canvasContext.canvas.width;

  const viewportWidth = document.body.clientWidth;

  const widthDenominator =
    viewportWidth < 768 ? results.length : results.length + 1;

  let barWidth;
  let lineGraphWidth;

  if (viewportWidth <= 568) {
    barWidth =
      results.length <= 10 ? canvasWidth / 10 : canvasWidth / widthDenominator;
    lineGraphWidth = 2;
  } else if (viewportWidth <= 1200) {
    barWidth =
      results.length <= 15 ? canvasWidth / 15 : canvasWidth / widthDenominator;
    lineGraphWidth = 4;
  } else {
    barWidth = results.length <= 20 ? 50 : canvasWidth / widthDenominator;
    lineGraphWidth = 5;
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

  //Pass this to drawGrid function
  canvasContext.font = `${viewportWidth <= 1200 ? 10 : 12}px ${font}`;

  //Turn this into drawGrid(canvasHeight, legendNums, )
  canvasContext.beginPath();
  for (let j = 0; j <= 10; j++) {
    const drawY = canvasHeight - ((canvasHeight * 0.9) / 10) * j;
    canvasContext.strokeStyle = "rgb(0, 0, 0, 0.5)";

    if (viewportWidth >= 768) {
      const spaces = " ".repeat(mostDigits - legendNums[j].length);
      canvasContext.strokeText(`${spaces + legendNums[j]}`, 0, drawY);
    }

    const stroke = j == 10 ? true : false;
    createGrid(canvas, canvasContext.strokeStyle, 0, drawY, stroke);
  }
  canvasContext.closePath();

  if (bars) {
    canvasContext.fillStyle = "rgba(100, 100, 255, 0.8)";
    canvasContext.strokeStyle = "rgb(100, 255, 235)";

    for (let k = 0; k < results.length; k++) {
      const resultValue = results[k];
      const barHeight = (resultValue / highestValue) * canvasHeight * 0.9;
      const barX = viewportWidth >= 768 ? (k + 1) * barWidth : k * barWidth;
      const inverseY = canvasHeight - barHeight;
      canvasContext.fillRect(barX, inverseY, barWidth, barHeight);
      canvasContext.strokeRect(barX, inverseY, barWidth, barHeight);
    }
  }

  if (lines) {
    //Turn this into separate function
    canvasContext.beginPath();
    canvasContext.strokeStyle = "rgb(50, 200, 50)";
    canvasContext.lineWidth = `${lineGraphWidth}`;
    const offSet = viewportWidth >= 768 ? barWidth * 1.5 : barWidth / 2;
    for (let l = 1; l < results.length; l++) {
      canvasContext.moveTo(
        offSet + (l - 1) * barWidth,
        canvasHeight - (results[l - 1] / highestValue) * canvasHeight * 0.9
      );
      canvasContext.lineTo(
        offSet + l * barWidth,
        canvasHeight - (results[l] / highestValue) * canvasHeight * 0.9
      );
    }
    canvasContext.stroke();
    canvasContext.closePath();
  }
}
