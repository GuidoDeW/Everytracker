function foo(num, x) {
  let roundedNum = Math.round(num * Math.pow(10, x)) / Math.pow(10, x);
  if (num > roundedNum) {
    roundedNum = foo(roundedNum, x - 1);
  } else {
    return roundedNum;
  }
  // if num > roundedNum, num has been rounded down
  // if num has been rounded down, continue
}

function roundMax(num, x) {
  //Round to 1 decimal
  let newNum = Math.round(num * 10) / 10;
  for (let i = 0; i <= x; i++) {
    //Round to next decimal
    let testNum = Math.round(num * Math.pow(10, x)) / Math.pow(10, x);
    //If  number rounded to i decimals is bigger than number rounded to i - 1 decimals,
    //last decimal < 5
    /*
    1.491

    newNum = 14.91 = 15 / 10 = 1.5

    testNum = 149.1 = 149 /100 = 1.49


    1.441

    newNum = 14.41 = 14 / 10 = 1.4
    testNum = 144.1 = 144 / 100 = 1.44

    testNum > newNum
    newNum = 1.44
*/
    if (testNum > newNum) {
      newNum = testNum;
    }
  }
  return newNum;
}

function bar(num, x) {
  let nextNum;
  let roundedNum;

  for (let i = x; i > 0; i--) {
    nextNum = Math.round(num * Math.pow(10, i - 1)) / Math.pow(10, i - 1);
    roundedNum = Math.round(num * Math.pow(10, i)) / Math.pow(10, i);
    if (nextNum <= roundedNum) {
      return roundedNum;
    }
  }
}

function foobar(num, x) {
  //
}
