export default function drawGraph(sheets) {
  const colors = ["red", "blue", "green", "orange"];
  sheets.forEach((sheet, index) => {
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

    const allResults = Array.from(sheet.columns).map((column) => {
      return Number(column.result);
    });

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
    canvasContext.strokeStyle = colors[index];
    canvasContext.shadowColor = colors[index];
    // canvasContext.strokeStyle = color ? color : "black";
    // canvasContext.shadowColor = color ? color : "black";
    canvasContext.beginPath();
    for (let j = 1; j < allResults.length; j++) {
      canvasContext.moveTo(
        (j - 1) * interval,
        zeroY - allResults[j - 1] / scale
      );
      canvasContext.lineTo(j * interval, zeroY - allResults[j] / scale);
    }
    canvasContext.stroke();
  });
}
