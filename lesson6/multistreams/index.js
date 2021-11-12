const worker_threads = require('worker_threads');

const genPassword = (size) => {
  return new Promise(((resolve, reject) => {
      const worker = new worker_threads.Worker('./worker.js', {
          workerData: size,
      });

      worker.on('message', resolve);
      worker.on('error', reject);
  }));
};

(async () => {
    const passwordBytesSize = 10;
    try {
        const result = await genPassword(passwordBytesSize);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
})();