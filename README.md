# NJOBS
Run some function, any function, on multiple threads up to the number of cores on your machine.
## Usage
```
npm install njobs
```

```
const runConcurrently = require('njobs');

// second argument is the number of concurrent threads
await runConcurrently(myfunc, 2);
console.log("Done!");
```

## Test
`node test.js`