export function unBlur(canvas) {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

export function clearChart(context) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

export function getHighestValue(arr) {
  if (arr.length < 40) {
    return Math.max(...arr);
  } else if (arr.length < 4000) {
    return Math.max.apply(null, arr);
  } else {
    let highest = arr[0];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > highest) {
        highest = arr[i];
      }
    }
    return highest;
  }
}

function buildGrid(context, color, clearSpace, drawY) {
  context.strokeStyle = color;
  context.moveTo(clearSpace, drawY);
  context.lineTo(context.canvas.width, drawY);
}

function getRatio(number) {
  return number > 10 ? 0.9 : number / (number + 1);
}

function getSignificantDecs(num, max) {
  let rounded;
  for (let i = 0; i <= max; i++) {
    let divisor = Math.pow(10, max);
    let multiplied = num * divisor;
    rounded = Math.round(multiplied) / divisor;
    if (rounded >= Math.floor(multiplied) / divisor) {
      return rounded;
    }
  }
}

function styleNumber(num) {
  const magnitude = Math.log10(Math.floor(num) + 1);
  if (magnitude <= 3) {
    return `${getSignificantDecs(num, 2)}`;
  } else {
    const factor =
      (num / Math.pow(10, magnitude)) * Math.pow(10, magnitude % 3);
    const prefix = getSignificantDecs(factor, 2);
    const suffixes = ["k", "m", "b", ""];
    return `${prefix}${suffixes[Math.floor(magnitude / 3) - 1]}`;
  }
}

export function drawGrid(
  context,
  canvasHeight,
  viewportWidth,
  breakpointWidth,
  highest,
  style
) {
  const legendNums = [];
  const number = highest < 10 ? Math.round(highest) : 10;

  let mostDigits = 0;

  for (let i = 0; i <= number; i++) {
    const numText = styleNumber((highest / number) * i);
    if (numText.length > mostDigits) {
      mostDigits = numText.length;
    }
    legendNums.push(numText);
  }

  const ratio = getRatio(highest);

  context.font = `${
    viewportWidth <= breakpointWidth ? 10 : 12
  }px Lucida Console, Courier, Monaco`;
  context.strokeStyle = style;

  context.beginPath();
  for (let j = 0; j <= number; j++) {
    const drawY = canvasHeight - ((canvasHeight * ratio) / number) * j;

    if (viewportWidth >= breakpointWidth) {
      const spaces = " ".repeat(mostDigits - legendNums[j].length);
      context.strokeText(`${spaces + legendNums[j]}`, 0, drawY);
    }

    buildGrid(context, context.strokeStyle, 0, drawY);
  }
  context.stroke();
  context.closePath();
}

export function drawBars(
  context,
  canvasHeight,
  viewportWidth,
  breakpointWidth,
  highest,
  arr,
  fillStyle,
  strokeStyle,
  sectionWidth
) {
  const ratio = getRatio(highest);
  context.fillStyle = fillStyle;
  context.strokeStyle = strokeStyle;

  for (let i = 0; i < arr.length; i++) {
    const resultValue = arr[i];
    const barHeight = (resultValue / highest) * canvasHeight * ratio;
    const barX =
      viewportWidth >= breakpointWidth
        ? (i + 1) * sectionWidth
        : i * sectionWidth;
    const inverseY = canvasHeight - barHeight;
    context.fillRect(barX, inverseY, sectionWidth, barHeight);
    context.strokeRect(barX, inverseY, sectionWidth, barHeight);
  }
}

export function drawLines(
  context,
  canvasHeight,
  viewportWidth,
  breakpointWidth,
  highest,
  arr,
  style,
  lineWidth,
  sectionWidth
) {
  const ratio = getRatio(highest);
  context.beginPath();
  context.strokeStyle = style;
  context.lineWidth = `${lineWidth}`;
  const offSet =
    viewportWidth >= breakpointWidth ? sectionWidth * 1.5 : sectionWidth / 2;
  for (let i = 1; i < arr.length; i++) {
    context.moveTo(
      (i - 1) * sectionWidth + offSet,
      canvasHeight - (arr[i - 1] / highest) * canvasHeight * ratio
    );
    context.lineTo(
      i * sectionWidth + offSet,
      canvasHeight - (arr[i] / highest) * canvasHeight * ratio
    );
  }
  context.stroke();
  context.closePath();
}
