const runConcurrently = require('./index');
const assert = require('assert');
const { performance } = require('perf_hooks');

const doWork = () => {
  let i = 0;
  while (i < 1000000000) {
    i += 1;
  }
  console.log('work complete')
}

const runSequentially = (times) => {
  let i = 0;
  while (i < times) {
    doWork();
    i += 1;
  }
}

const isMain = () => {
  return !(process.env.child);
};

const test = async () => {
    try {
      let startSeq, endSeq, startConc, endConc;

      if (isMain()) {
        startSeq = performance.now();
        runSequentially(6);
        endSeq = performance.now();
      }

      if (isMain()) {
        startConc = performance.now();
      }
      // do 16 jobs on 4 threads faster than 6 on one
      await runConcurrently(doWork, 16, 4);

      if (isMain()) {
        endConc = performance.now();
        
        console.info(`Single process took ${endSeq - startSeq} to run`);
        console.info(`Concurrent process took ${endConc - startConc} to run`);

        assert(endSeq - startSeq > endConc - startConc);
      }
      
    } catch (e) {
      console.warn(e);
    }
};

test();

