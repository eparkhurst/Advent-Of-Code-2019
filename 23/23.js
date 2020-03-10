const fs = require('fs');
const { IntComputer } = require('./intComp');

fs.readFile('./data', 'utf8', (err, data) => {
  if (err) throw err;
  const strArr = data.trim().split(',');
  const program = strArr.map(num => Number(num));
  run(program);
});

const run = (program) => {
  const netWork = [];
  const pending = {};
  let t = 0;
  for (let i = 0; i < 50 ; i++) {
    netWork.push(new IntComputer(program));
    pending[i] = [i,-1];
  }
  while (t<10000){
    for (let i = 0; i < netWork.length; i++) {
      const input = pending[i].length ? pending[i] : [-1];
      pending[i] = [];
      const output = netWork[i].runComp(input);
      if(output){
        if(output[0] === 255){
          console.log(output);
          return
        }
        pending[output[0]].push(output[1],output[2]);
      }
      t++;
    }
  }
  console.log('not done');
};
