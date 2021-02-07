export function wipeChart(context) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

export default function drawBars(canvas, results) {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const canvasContext = canvas.getContext("2d");
  wipeChart(canvasContext);

  const zeroY = canvasContext.canvas.height;
  // const allResults = [...Store.getCurrentSheet().columns].map((column) => {
  //   return Number(column.result);
  // });

  // const barWidth = (function () {
  //   if (window.innerWidth <= 568) {
  //     return results.length <= 10
  //       ? canvasContext.canvas.width / 10
  //       : canvasContext.canvas.width / results.length;
  //   } else if (window.innerWidth <= 1200) {
  //     return results.length <= 15
  //       ? canvasContext.canvas.width / 15
  //       : canvasContext.canvas.width / results.length;
  //   } else {
  //     return results.length <= 20
  //       ? 50
  //       : canvasContext.canvas.width / results.length;
  //   }
  // })();

  // if (window.innerWidth <= 568) {
  //   barWidth =
  //     results.length <= 10
  //       ? canvasContext.canvas.width / 10
  //       : canvasContext.canvas.width / results.length;
  // } else if (window.innerWidth <= 1600) {
  //   barWidth = Math.min(50, canvasContext.canvas.width / results.length);
  // } else {
  //   barWidth =
  //     results.length <= 20 ? 50 : canvasContext.canvas.width / results.length;
  // }

  let barWidth;

  if (window.innerWidth <= 568) {
    barWidth =
      results.length <= 10
        ? canvasContext.canvas.width / 10
        : canvasContext.canvas.width / results.length;
  } else if (window.innerWidth <= 1200) {
    barWidth =
      results.length <= 15
        ? canvasContext.canvas.width / 15
        : canvasContext.canvas.width / results.length;
  } else {
    barWidth =
      results.length <= 20 ? 50 : canvasContext.canvas.width / results.length;
  }

  let highestValue = results[0];

  results.forEach((result) => {
    if (result > highestValue) {
      highestValue = result;
    }
  });

  canvasContext.fillStyle = "rgb(100, 100, 255)";
  canvasContext.strokeStyle = "rgb(100, 255, 235)";
  //Number-popup related
  canvasContext.font = "16px Arial";

  for (let j = 0; j < results.length; j++) {
    const resultValue = results[j];
    const barHeight =
      (resultValue / highestValue) * canvasContext.canvas.height - 25;
    const barX = j * barWidth;
    const inverseY = zeroY - barHeight;
    canvasContext.fillRect(barX, inverseY, barWidth, barHeight);

    canvasContext.strokeRect(barX, inverseY, barWidth, barHeight);
    // Number-popup relatede
    canvas.addEventListener("click", (e) => {
      const canvasRect = e.target.getBoundingClientRect();
      if (
        e.clientX - canvasRect.left > barX &&
        e.clientX - canvasRect.left < barX + barWidth &&
        e.clientY - canvasRect.top > inverseY
      ) {
        canvasContext.clearRect(0, 0, canvasContext.canvas.width, 25);
        canvasContext.strokeStyle = "rgb(0, 0, 0)";
        //Add number of empty spaces behind text to shift it to the middle?
        canvasContext.strokeText(resultValue, barX, 16);
      }
    });
  }

  //Alternative: use spread operator to pass in all parameters required for drawing bars

  // const barParams = [
  //   j * barWidth,
  //   zeroY - ((results[j] / highestValue) * canvasContext.canvas.height - 25),
  //   barWidth,
  //   (results[j] / highestValue) * canvasContext.canvas.height - 25,
  // ];
}
