const fs = require('fs');
console.time("dbsave");

fs.readFile('./data.js', 'utf8', (err, data) => {
  if (err) throw err;
  const arr = data.split(',');
  const ans = bruteForce(arr);
  console.log(ans);
  console.timeEnd("dbsave");
});

const bruteForce = (arr) => {
  for (let i = 0; i < 100; i ++){
    for (let j = 0; j < 100; j++){
      const memory = [...arr];
      memory[1] = i;
      memory[2] = j;
      const calculated = runComputer(memory);
      if (calculated == 19690720) {
        return {
          noun: i,
          verb: j,
        }
      }
    }
  }
  return 'not Found'
}

const runComputer = (arr) => {
  for (let i = 0; i < arr.length; i += 4){
    if(arr[i] == 1){
      arr = add(arr,i)
    } else if (arr[i] == 2) {
      arr = multiply(arr,i);
    } else if(arr[i] == 99) {
      return arr[0]
    } else {
      console.log('Error');
    }
  }
};

const add = (arr, pos) => {
  const newVal = Number(arr[arr[pos+1]]) + Number(arr[arr[pos+2]]);
  arr[arr[ pos + 3]] = newVal;
  return arr;
}

const multiply = (arr, pos) => {
  const newVal = Number(arr[arr[pos+1]]) * Number(arr[arr[pos+2]]);
  arr[arr[ pos + 3]] = newVal;
  return arr
}

// console.log(runComputer([1,1,1,4,99,5,6,0,99]));
