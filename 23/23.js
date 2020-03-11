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
  let nat = [];
  let activeComps = 0;
  const previousNats = [];
  for (let i = 0; i < 50 ; i++) {
    netWork.push(new IntComputer(program));
    pending[i] = [i,-1];
  }
  while (true){
    for (let i = 0; i < netWork.length; i++) {
      const input = pending[i].length ? pending[i] : [-1];
      pending[i] = [];
      const output = netWork[i].runComp(input);
      if(output){
        activeComps ++;
        if(output[0] === 255){
          nat = [output[1], output[2]];
        }else {
          pending[output[0]].push(output[1],output[2]);
        }
      }
      t++;
    }
    if(activeComps === 0){
      pending[0] = nat;
      if(previousNats.includes(nat[1])){
        console.log(nat[1]);
        return;
      }
      previousNats.push(nat[1]);
    }
    activeComps = 0;
  }
  console.log('not done');
};
