const fs = require('fs');
console.time("dbsave");

fs.readFile('./data', 'utf8', (err, data) => {
  if (err) throw err;
  data = data.trim();
  // data = '03036732577212944063491565474664';
  // data = '02935109699940807407585447034323';
  // data = '03081770884921959731165446850517';
  const offSet = data.substring(0,7);
  const arrData = data.split('').map(n => Number(n));
  const longData = [];
  for(let i =0; i<10000;i++){
    longData.push(...arrData);
  }
  console.log(longData.slice(Number(offSet)).length);
  runAllPhases(longData.slice(Number(offSet)), 100);
  console.timeEnd("dbsave");
});

const runAllPhases = (input, n) => {
  let phaseEnd = input;
  for (let i = 0; i < n; i++) {
    phaseEnd = runPhase(phaseEnd);
  }
  console.log(phaseEnd.slice(0,8).join(''));
};

const runPhase = (input) => {
  const abs = Math.abs;
  let final = [];
  let last = 0;
  for (let i = input.length - 1; i >= 0; i--){
    last = input[i] + last;
    final.push(abs(last % 10));
  }
  return final.reverse();
};

// too Low: 49245573
