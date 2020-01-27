const fs = require('fs');

fs.readFile('./data', 'utf8', (err, data) => {
  if (err) throw err;

  runAllPhases(data, 100);
});
pattern = [0,1,0,-1];

const runAllPhases = (input, n) => {
  const multiples = getMultipliers(input.length);
  let phaseEnd = input;
  for (let i = 0; i < n; i ++) {
    phaseEnd = runPhase(phaseEnd, multiples);
  };
  console.log(phaseEnd.slice(0,8));
};

const runPhase = (input, multiples) => {
  const arr = (''+input).split('').map(n => Number(n));
  let final = '';
  for (let i = 0; i < input.length; i++){
    const line = Math.abs(arr.reduce((p,c,j) => {
      return p + (c * multiples[i][j])
    },0));
    final += '' + (line%10);
  }
 return final
};

const getMultipliers = (length) => {
  const allMultipliers = [];
  for(let i = 1; i <= length; i++){
    let mid = pattern.reduce((nextArr, num) => {
      for(let j = 0; j < i; j++){
        nextArr.push(num)
      }
      return nextArr;
      }, []);
    while(mid.length < length + 1){
      mid = [...mid, ...mid];
    }
    allMultipliers.push(mid.slice(1,length+1));
  }
  return allMultipliers;
};

