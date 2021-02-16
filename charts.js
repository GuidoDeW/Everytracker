import { getAllResults } from "./classes.js";
import * as chartState from "./chart_state.js";
import {
  unBlur,
  clearChart,
  getHighestValue,
  drawGrid,
  drawBars,
  drawLines,
} from "./chart_utils.js";

export default function drawChart(canvas) {
  const canvasContext = canvas.getContext("2d");
  const results = getAllResults();
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

  drawGrid(...sharedArgs, 10, "rgb(0, 0, 0, 0.5)");

  if (chartState.hasBars()) {
    drawBars(
      ...sharedArgs,
      results,
      "rgba(100, 100, 255, 0.8)",
      "rgb(100, 255, 235)",
      sectionWidth
    );
  }

  if (chartState.hasLines()) {
    drawLines(
      ...sharedArgs,
      results,
      "rgb(50, 200, 50)",
      lineGraphWidth,
      sectionWidth
    );
  }

  chartState.setDrawn(true);
}
