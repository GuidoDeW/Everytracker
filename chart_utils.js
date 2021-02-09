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
  if (stroke) {
    canvasContext.stroke();
  }
}

export function styleNumber(num) {
  const magnitude = Math.floor(Math.log10(num));
  if (magnitude >= 3) {
    const factor =
      (num / Math.pow(10, magnitude)) * Math.pow(10, magnitude % 3);

    let prefix;

    if (
      Number(factor.toFixed(2)) - Number(Math.floor(factor).toFixed(2)) >=
      0.05
    ) {
      prefix = factor.toFixed(2);
    } else if (
      Number(factor.toFixed(1)) - Number(Math.floor(factor).toFixed(1)) >=
      0.5
    ) {
      prefix = factor.toFixed(1);
    } else {
      prefix = factor.toFixed(0);
    }

    // const prefix =
    //   Number(Math.floor(factor).toFixed(1)) === Number(factor.toFixed(1))
    //     ? factor.toFixed(0)
    //     : factor.toFixed(1);
    let suffix;
    if (magnitude < 6) {
      suffix = "k";
    } else if (magnitude < 9) {
      suffix = "m";
    } else if (magnitude < 12) {
      suffix = "b";
    }
    return `${prefix}${suffix}`;
  }
  return `${num}`;
}
