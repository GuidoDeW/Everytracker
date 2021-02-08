export function clearChart(canvas) {
  const canvasContext = canvas.getContext("2d");
  canvasContext.clearRect(
    0,
    0,
    canvasContext.canvas.width,
    canvasContext.canvas.height
  );
}

export function setGrid(canvas, clearSpace, drawY, stroke) {
  const canvasContext = canvas.getContext("2d");
  canvasContext.strokeStyle = "rgba(0, 0, 0, 0.5)";

  canvasContext.moveTo(clearSpace, drawY);
  canvasContext.lineTo(canvasContext.canvas.width, drawY);
  if (stroke) {
    canvasContext.stroke();
  }
}
