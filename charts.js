import {
  unBlur,
  clearChart,
  getHighestValue,
  drawGrid,
  drawBars,
  drawLines,
} from "./chart_utils.js";

export default function drawChart(canvas, results, bars, lines, font) {
  const canvasContext = canvas.getContext("2d");
  unBlur(canvas);
  clearChart(canvasContext);
  const canvasWidth = canvasContext.canvas.width;
  const viewportWidth = document.body.clientWidth;
  const breakpointWidth = 768;

  const widthDenominator =
    viewportWidth < breakpointWidth ? results.length : results.length + 1;

  let sectionWidth;
  let lineGraphWidth;

  if (viewportWidth <= 568) {
    sectionWidth =
      results.length <= 10 ? canvasWidth / 10 : canvasWidth / widthDenominator;
    lineGraphWidth = 2;
  } else if (viewportWidth <= 1200) {
    sectionWidth =
      results.length <= 15 ? canvasWidth / 15 : canvasWidth / widthDenominator;
    lineGraphWidth = 4;
  } else {
    sectionWidth = results.length <= 20 ? 50 : canvasWidth / widthDenominator;
    lineGraphWidth = 5;
  }

  const sharedArgs = [
    canvasContext,
    canvasContext.canvas.height,
    viewportWidth,
    breakpointWidth,
    getHighestValue(results),
  ];

  drawGrid(...sharedArgs, 10, font, "rgb(0, 0, 0, 0.5)");

  if (bars) {
    drawBars(
      ...sharedArgs,
      results,
      "rgba(100, 100, 255, 0.8)",
      "rgb(100, 255, 235)",
      sectionWidth
    );
  }

  if (lines) {
    drawLines(
      ...sharedArgs,
      results,
      "rgb(50, 200, 50)",
      lineGraphWidth,
      sectionWidth
    );
  }
}
