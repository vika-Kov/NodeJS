//importing event module
const EventEmitter = require("events");

//new emitter
emitter = new EventEmitter();

emitter.on("endTime", (timer) => {
  console.log(timer.timerName, "закончился");
});
//arguments collection
const argvLength = process.argv.length;
const args = process.argv;
const timers = [];

for (let i = 2; i < argvLength; i++) {
  const timerName = "timer" + (i - 1);
  //hh-dd-mm-yy один таймер
  // hh-dd-mm-yy hh-dd-mm-yy два таймера 
  const [hour, day, month, year] = [...args[i].split("-")];
  const seconds =
     hour * 3600 +
     day * 24 * 3600 +
     month * 30 * 24 * 3600 +
     year * 365 * 30 * 24 * 3600;
  

  const timer = {
    timerName,
    seconds,
  };

  timers.push(timer);
}

const countdownTimer = setInterval(() => {
  console.clear();
  console.table(timers);
  
  if (timers.reduce((acc, t) => acc + t.seconds, 0) === 0) {
    console.log("all timer are 0");
    clearInterval(countdownTimer);
  }
  
  for (let t of timers) {
    if (t.seconds === 0) {
      // t.seconds = 0;
      emitter.emit("endTime", t);
    } else {
      t.seconds -= 1;
    }
  }
}, 1000);
