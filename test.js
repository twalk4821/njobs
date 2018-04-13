const runConcurrently = require('./index');

const doWork = () => {
  let i = 0;
  while (i < 1000000000) {
    i += 1;
  }
}

const runSequentially = (times) => {
  let i = 0;
  while (i < times) {
    doWork();
    i += 1;
  }
}

const test = async () => {
  try {
    console.time('sequential');    
    runSequentially(8);
    console.timeEnd('sequential');

    console.time('concurrent');
    await runConcurrently(doWork, 8, 4);
    console.timeEnd('concurrent');

  } catch (e) {
    console.log(e);
  }
};

test();
