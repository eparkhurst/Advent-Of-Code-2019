const { intComputer } = require('./intComp');
const fs = require('fs');

fs.readFile('./data.js', 'utf8', (err, data) => {
  if (err) throw err;
  const strArr = data.split(',');
  paint(strArr)

});

const paint = (program) => {
  const outPut = [];
  const compA = new intComputer(outPut, program, 0);
  compA.runComp([0]);
  console.log(outPut);
}
