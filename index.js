const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const workers = {};

const runConcurrently = async (job, numJobs = 2) => {
  if (!job) {
    console.log(`No job specified.`);
    process.exit(1);
  }
  
  if (numJobs > numCPUs) {
    console.log(`Maximum cpus on your device is ${numCPUs}. You specified ${numJobs}`);
    process.exit(1);
  }

  if (cluster.isMaster) {
    let finished = 0;

    for (let i = 0; i < numJobs; i++) {
      const worker = cluster.fork();
      workers[worker.id] = worker;
    }
  
    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} finished`);
      finished += 1;
      if (finished === numJobs) {
        console.log('done')
      }
    });
  
  } else {
    console.log(`Worker ${process.pid} started`);   
    await job();
    process.exit();
  }
}

module.exports = runConcurrently;