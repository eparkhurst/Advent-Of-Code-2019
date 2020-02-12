const { IntComputer } = require('./intComp');
const fs = require('fs');
console.time("dbsave");

fs.readFile('./data', 'utf8', (err, data) => {
  if (err) throw err;
  const strArr = data.split(',');
  const program = strArr.map(num => Number(num));
  console.log(getBeam(program));
  console.timeEnd("dbsave");
});

// Takes like 20s but it works

const getBeam = (program) => {
  let total = 0;
  let last = 0;
  let minX = 0;
  for (let i = 0; i < 10000; i++) {
    last = 0;
    total = 0;
    for (let j = minX; j < 10000; j++) {
      const comp = new IntComputer(program);
      const newVal = Number(comp.runComp([j, i]));
      if(newVal){
        total++
      }
      if(total > 100 && newVal){
        const status = test(j, i, program);
        if(status) {
          console.log('x', j);
          console.log('y', i);

          return ((j-99)*10000)+i;
        }
      }
      if(last < newVal){
        minX = j-1
      } else if(last > newVal){
        break;
      }
      last = newVal;
    }
  }
  return 'not Found'
}

const test = (x,y, program) => {
  const comp = new IntComputer(program);
  const newVal = Number(comp.runComp([x-99, y+99]));
  return newVal
}
