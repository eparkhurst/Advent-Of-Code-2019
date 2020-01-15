const { intComputer } = require('./intComp');
const fs = require('fs');
console.time("dbsave");

fs.readFile('./data.js', 'utf8', (err, data) => {
  if (err) throw err;
  const strArr = data.split(',');
  const program = strArr.map(num => Number(num));
  console.log(runAllComps(program));
});

const getAllPermutations = (arr) => {
  const results = [];

  if (arr.length === 1) {
    results.push(arr);
    return results;
  }

  for (let i = 0; i < arr.length; i++) {
    const firstChar = arr[i];
    const charsLeft = [...arr.slice(0,i),...arr.slice(i+1)];
    const innerPermutations = getAllPermutations(charsLeft);
    for (let j = 0; j < innerPermutations.length; j++) {
      results.push([firstChar, ...innerPermutations[j]]);
    }
  }
  return results;
};

const runAllComps = (program) => {
  let code = [];

  const allPerms = getAllPermutations([5,6,7,8,9]);
  // const allPerms = getAllPermutations([0, 1, 2, 3, 4]);
  // const allPerms = [[9,8,7,6,5]];
  const final = allPerms.reduce((max, current) => {
    const output = runSequence(current, program);
    if(output > max){
      code = current;
      return output
    }
    return max
  }, 0);
  console.log('final', final);
  console.log('code', code);
  return final;
}

const runSequence = (phases, program) => {
  const outA = [];
  const outB = [];
  const outC = [];
  const outD = [];
  const outE = [0];
  const compA = new intComputer(outA, program, phases[0]);
  const compB = new intComputer(outB, program, phases[1]);
  const compC = new intComputer(outC, program, phases[2]);
  const compD = new intComputer(outD, program, phases[3]);
  const compE = new intComputer(outE, program, phases[4]);
  let n = 0;
  while (outE.length<2 && n < 100){
    compA.runComp([outE[0]]);
    compB.runComp([outA[0]]);
    compC.runComp([outB[0]]);
    compD.runComp([outC[0]]);
    compE.runComp([outD[0]]);
    n++
  }
  return outE[0]
};

//
// const x = runAllComps([3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,
//   1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0]);
// const x = runAllComps([3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,
//   27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5]);

// const x = runSequence([1,1,1,1,1],[3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,
//   1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0]);

// console.log(x);

//[1,2,3]


