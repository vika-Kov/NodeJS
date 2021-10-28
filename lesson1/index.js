const colors = require("colors/safe");
const args = process.argv;
const start = Number.parseInt(args[2]);
const end = Number.parseInt(args[3]);
let count = -1;

function isPrime(num) {
  if (num === 2) return true;
  if (num < 2 || num % 2 === 0) return false;
  for (let i = 3; i * i <= num; i += 2) if (num % i === 0) return false;
  return true;
}

if (start > end || !Number.isInteger(start) || !Number.isInteger(end)) {
  throw new Error("Wrong set of arguments");
  // console.log(Number.isInteger(start));
  // console.log(Number.isInteger(end));
}

for (let i = start; i <= end; i++) {
  if (isPrime(i)) {
    if (count < 0) {
      count = 0;
    }

    count++;

    switch (count) {
      case 1:
        console.log(colors.red(i));
        break;
      case 2:
        console.log(colors.green(i));
        break;
      case 3:
        console.log(colors.yellow(i));
        count = 0;
        break;
    }
  }
}

if (count < 0) {
  console.log(colors.red("There are no prime numbers"));
}