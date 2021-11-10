const worker_threads = require('worker_threads');
const crypto = require('crypto');

const password = crypto
    .randomBytes(worker_threads.workerData)
    .toString('hex');

worker_threads.parentPort.postMessage(password);
