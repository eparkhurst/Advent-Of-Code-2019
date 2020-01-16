const { intComputer } = require('./intComp');
const fs = require('fs');

fs.readFile('./data.js', 'utf8', (err, data) => {
  if (err) throw err;
  const strArr = data.split(',');
  const program = strArr.map(num => Number(num));
  console.log(runComputer(program));
});

const runComputer = (program) => {
  const outPut = [];
  const compA = new intComputer(outPut, program, 0);
  compA.runComp([2]);
  return outPut
};

// 2809146684 is too high
