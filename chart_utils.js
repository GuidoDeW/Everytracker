export function unBlur(canvas) {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

export function clearChart(canvas) {
  const canvasContext = canvas.getContext("2d");
  canvasContext.clearRect(
    0,
    0,
    canvasContext.canvas.width,
    canvasContext.canvas.height
  );
}

export function createGrid(canvas, color, clearSpace, drawY, stroke) {
  const canvasContext = canvas.getContext("2d");
  canvasContext.strokeStyle = color;

  canvasContext.moveTo(clearSpace, drawY);
  canvasContext.lineTo(canvasContext.canvas.width, drawY);
  if (stroke) canvasContext.stroke();
}

export function getSignificantDecs(num, max) {
  let rounded;
  for (let i = 0; i <= max; i++) {
    let divisor = Math.pow(10, max);
    let multiplied = num * divisor;
    rounded = Math.round(multiplied) / divisor;
    if (rounded >= Math.floor(multiplied) / divisor) return rounded;
  }
}

export function styleNumber(num) {
  const magnitude = Math.floor(Math.log10(num));
  if (magnitude < 3) {
    return `${num}`;
  } else {
    const factor =
      (num / Math.pow(10, magnitude)) * Math.pow(10, magnitude % 3);
    const prefix = getSignificantDecs(factor, 2);
    const suffixes = ["k", "m", "b", ""];
    return `${prefix}${suffixes[Math.floor(magnitude / 3) - 1]}`;
  }
}

// let suffix;
// if (magnitude < 6) {
//   suffix = "k";
// } else if (magnitude < 9) {
//   suffix = "m";
// } else if (magnitude < 12) {
//   suffix = "b";
// }
// return `${prefix}${suffix}`;

// const prefix = factor.toFixed(
//   Math.max(
//     0,
//     Math.max(
//       Math.round(
//         Number(factor.toFixed(2)) - Number(Math.floor(factor.toFixed(2)))
//       ) * 10,
//       Math.round(
//         Number(factor.toFixed(1)) - Number(Math.floor(factor.toFixed(1)))
//       )
//     )
//   )
// );

// const prefix = factor.toFixed(
//   Math.max(
//     0,
//     Math.round(
//       Number(factor.toFixed(1)) - Number(Math.floor(factor.toFixed(1)))
//     ),
//     Math.round(
//       Number(factor.toFixed(2)) - Math.floor(Number(factor.toFixed(2)))
//     )
//   )
// );

// const prefix = factor.toFixed(
//   Math.max(
//     0,

//     Math.round(
//       Number(factor.toFixed(1)) - Number(Math.floor(factor).toFixed(0))
//     ),

//     Number(factor.toFixed(2)) - Number(Math.floor(factor).toFixed(1))
//   ) * 20
// );

// let prefix;

// if (
//   Number(factor.toFixed(2)) - Number(Math.floor(factor).toFixed(2)) >=
//   0.05
//   //I.e. if Math.round(factor * Math.pow(10, 2) / Math.pow(10, 2) > Math.floor(factor * Math.pow(10, 2) / Math.pow(10, 2))
// ) {
//   prefix = factor.toFixed(2);
// } else if (
//   Number(factor.toFixed(1)) - Number(Math.floor(factor).toFixed(1)) >=
//   0.5
// ) {
//   prefix = factor.toFixed(1);
// } else {
//   prefix = factor.toFixed(0);
// }

// let prefix;

// if (
//   Math.round((factor * Math.pow(10, 2)) / Math.pow(10, 2)) >=
//   Math.floor((factor * Math.pow(10, 2)) / Math.pow(10, 2))

//   //I.e. if Math.round(factor * Math.pow(10, 2) / Math.pow(10, 2) > Math.floor(factor * Math.pow(10, 2) / Math.pow(10, 2))
// ) {
//   prefix = Math.round(factor * Math.pow(10, 2)) / Math.pow(10, 2);
// } else if (
//   Math.round(factor * Math.round(10, 1)) / Math.pow(10, 1) >=
//   Math.floor(factor * Math.pow(10, 1)) / Math.pow(10, 1)
// ) {
//   prefix = Math.round(factor * Math.pow(10, 1)) / Math.pow(10, 1);
// } else {
//   prefix = Math.round(factor);
// }
