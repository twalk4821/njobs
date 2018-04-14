const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const runConcurrently = async (job, numJobs = 1, numForks) => {
  if (!job) {
    throw new Error(`No job specified.`);
  }
  
  if (numForks > numCPUs) {
    throw new Error(`Maximum cpus on your device is ${numCPUs}. You tried to use ${numForks}`);
  }

  if (numForks > numJobs) {
    numForks = numJobs;
  }

  if (!numForks) {
    if (numJobs > numCPUs) {
      numForks = numCPUs;
    } else {
      numForks = numJobs;
    }
  }

  if (cluster.isMaster) {
    let jobsAssigned = 0;
    let jobsCompleted = 0;

    for (let i = 0; i < numForks; i++) {
      const worker = cluster.fork({ child: 1 });
      jobsAssigned += 1;
    }

    return new Promise((resolve, reject) => {
      cluster.on('message', ({ id }) => {
        jobsCompleted += 1;

        if (jobsCompleted === numJobs) {
          console.info(`${numJobs} jobs complete. Killing workers.`)

          workerIDs = Object.keys(cluster.workers);
          for (let i = 0; i < workerIDs.length; i++) {
            const id = workerIDs[i];
            const worker = cluster.workers[id];
            worker.kill();
          }
          
          console.info('done.')
          resolve(true);
        } else {
          if (jobsAssigned < numJobs) {
            cluster.workers[id].send('work');     
            jobsAssigned += 1;              
          } else {
            cluster.workers[id].kill();
          }
        }
      });
    });

  } else {
    console.log(`Worker ${cluster.worker.id} started`);   

    const work = async () => {
      await job();
      cluster.worker.send({ id: cluster.worker.id });
    };

    process.on('message', (msg) => {
      if (msg === 'work') {
        work();
      }
    });

    work();
  }
}

module.exports = runConcurrently;
