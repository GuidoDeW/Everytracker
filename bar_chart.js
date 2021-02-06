export default function drawBars(canvas, results) {
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
  // const allResults = [...Store.getCurrentSheet().columns].map((column) => {
  //   return Number(column.result);
  // });

  const interval =
    results.length <= 10
      ? Math.round(canvasContext.canvas.width / 10)
      : Math.round(canvasContext.canvas.width / (results.length - 1));

  let highestValue = results[0];
  for (let i = 0; i < results.length; i++) {
    if (results[i] > highestValue) {
      highestValue = results[i];
    }
  }

  //Replace this with a dynamic colour generator that a) only generates every colour once
  // and b) generates the same specific colour for the same specific interval on every
  // function invocation.
  //Possible solution: generate RGB values

  /*
    const colors = [];
    let red = 255;
    let blue = 
    for(let k = 0; k < results.length; k++) {
      let red;
      let blue;
      let green;
      if(k % 2 === 0 && k % 3 !== 0) {
        
      } else if (k % 3 === 0) {

      } else {

      }
    }
  
  */

  //Generate colours dynamically or hand-pick 30 good-looking colours
  const colors = [
    "red",
    "blue",
    "yellow",
    "green",
    "orange",
    "purple",
    "pink",
    "gold",
  ];

  for (let j = 0; j < results.length; j++) {
    //Change this dynamically later
    canvasContext.fillStyle = colors[j];
    const barHeight =
      (results[j] / highestValue) * canvasContext.canvas.height - 10;
    canvasContext.fillRect(
      j * interval,
      zeroY - barHeight,
      interval,
      barHeight
    );
  }
}
