const { IntComputer } = require('./intComp');
const fs = require('fs');

fs.readFile('./data', 'utf8', (err, data) => {
  if (err) throw err;
  const strArr = data.split(',');
  const program = strArr.map(num => Number(num));
  fs.readFile('./script', 'utf8', (err, data) => {
    if (err) throw err;
    let charCode = []
    for (let i = 0; i < data.length; i++) {
      charCode.push(data.charCodeAt(i))
    }
    getDamage(program,charCode);
  });
});

const getDamage = (program, script) => {
  const comp = new IntComputer(program);
  const output = comp.runComp(script);
  console.log(output);
  console.log(String.fromCharCode(...output));
};
// jump is 6
