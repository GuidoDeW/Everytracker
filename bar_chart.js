export function wipeChart(context) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

export default function drawBars(canvas, results) {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const canvasContext = canvas.getContext("2d");
  wipeChart(canvasContext);

  const zeroY = canvasContext.canvas.height;

  const viewportWidth = document.body.clientWidth;
  let barWidth;

  if (viewportWidth <= 568) {
    barWidth =
      results.length <= 10
        ? canvasContext.canvas.width / 10
        : canvasContext.canvas.width / (results.length + 1);
  } else if (viewportWidth <= 1200) {
    barWidth =
      results.length <= 15
        ? canvasContext.canvas.width / 15
        : canvasContext.canvas.width / (results.length + 1);
  } else {
    barWidth =
      results.length <= 20
        ? 50
        : canvasContext.canvas.width / (results.length + 1);
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
    const drawY =
      canvasContext.canvas.height -
      ((canvasContext.canvas.height - 50) / 10) * i;
    let textSpace = barWidth;
    if (viewportWidth >= 768) {
      const barInterval = Math.round(highestValue / 10) * i;
      const spaces = " ".repeat(mostDigits - barInterval.toString().length);
      canvasContext.strokeStyle = "rgb(0, 0, 0)";
      canvasContext.strokeText(`${spaces + barInterval}`, 0, drawY);
    } else {
      textSpace = 0;
    }
    canvasContext.strokeStyle = "rgba(0, 0, 0, 0.5)";
    canvasContext.moveTo(textSpace, drawY);
    canvasContext.lineTo(canvasContext.canvas.width, drawY);
  }

  canvasContext.stroke();

  canvasContext.fillStyle = "rgb(100, 100, 255)";
  canvasContext.strokeStyle = "rgb(100, 255, 235)";
  //Number-popup related

  for (let j = 0; j < results.length; j++) {
    const resultValue = results[j];
    const barHeight =
      (resultValue / highestValue) * canvasContext.canvas.height - 50;
    const barX = viewportWidth >= 768 ? (j + 1) * barWidth : j * barWidth;
    const inverseY = zeroY - barHeight;
    canvasContext.fillRect(barX, inverseY, barWidth, barHeight);
    canvasContext.strokeRect(barX, inverseY, barWidth, barHeight);
  }
}

// Take highest value
// Divide by ten
//At 10% height, stroke 10% of highest value
//...etc.

//At highest point - 50, draw highest value
// Go down 10% (of total height - 50), and draw highestvalue - 10%

// etc.

// for (let k = highestValue; k > 1; k--) {
//   canvasContext.strokeText(
//     `${(highestValue / 10) * k}`,
//     0,
//     (canvasContext.canvas.height / 10) * k
//   );
// }

//Alternative: use spread operator to pass in all parameters required for drawing bars

// const barParams = [
//   j * barWidth,
//   zeroY - ((results[j] / highestValue) * canvasContext.canvas.height - 25),
//   barWidth,
//   (results[j] / highestValue) * canvasContext.canvas.height - 25,
// ];

// canvas.addEventListener("click", (e) => {
//   const canvasRect = e.target.getBoundingClientRect();
//   if (
//     e.clientX - canvasRect.left > barX &&
//     e.clientX - canvasRect.left < barX + barWidth &&
//     e.clientY - canvasRect.top > inverseY
//   ) {
//     canvasContext.clearRect(0, 0, canvasContext.canvas.width, 25);
//     canvasContext.strokeStyle = "rgb(0, 0, 0)";
//     canvasContext.strokeText(resultValue, barX, 16);
//   }
// });
