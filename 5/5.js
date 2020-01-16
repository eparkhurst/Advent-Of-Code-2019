const fs = require('fs');
console.time("dbsave");

fs.readFile('./data.js', 'utf8', (err, data) => {
  if (err) throw err;
  const strArr = data.split(',');
  const arr = strArr.map(num => Number(num));
  console.log(runComputer(5, arr));
  console.timeEnd("dbsave");
});

const runComputer = (origInput, arr) => {
  let n = 0;
  let myOutput = [];
  const input = (array, pos) => {
    array[array[pos+1]] = origInput;
    return 2
  };

  const output = (array, pos, parsed) => {
    const { p1 } = parsed;
    myOutput.push(getVal(array,pos+1, p1));
    return 2
  };

  const jumpTrue = (arr, pos, parsed) => {
    const { p1, p2 } = parsed;
    if(getVal(arr,pos+1, p1) != 0){
      n = getVal(arr,pos+2, p2);
      return 0;
    }
    return 3
  };

  const jumpFalse = (arr, pos, parsed) => {
    const { p1, p2 } = parsed;
    if(getVal(arr,pos+1, p1) == 0){
      n = getVal(arr,pos+2, p2);
      return 0;
    }
    return 3
  };

  const codeDict = {
    '01': add,
    '02': multiply,
    '03': input,
    '04': output,
    '05': jumpTrue,
    '06': jumpFalse,
    '07': lessThan,
    '08': equals,
  };
  let t = 0;
  while(arr[n] != 99 && t< 1000){
    console.log('n', n);
    const parsed = parseOptCode(arr[n]);
    const inc = codeDict[parsed.optCode](arr, n, parsed);
    n += inc;
    t++
  }
  console.log('output', myOutput);
  // console.log(arr);
};

const parseOptCode = (code) => {
  console.log(code);
  code = code + '';
  const arr = code.split('');
  const len = arr.length;
  const optCode = (arr[len-2] || '0') + arr[len-1];
  const p1 = arr[len-3] ||'0';
  const p2 = arr[len-4] ||'0';
  const p3 = arr[len-5] ||'0';
  return { optCode, p1, p2, p3 };
};

const getVal = (arr, pos, code) => {
  return code === '1' ? arr[pos]: arr[arr[pos]]
};

const add = (arr, pos, parsed) => {
  const { p1, p2 } = parsed;
  const newVal = Number(getVal(arr,pos+1, p1)) + Number(getVal(arr,pos+2, p2));
  arr[arr[ pos + 3]] = newVal;
  return 4;
};

const multiply = (arr, pos, parsed) => {
  const { p1, p2 } = parsed;
  arr[arr[ pos + 3]] = Number(getVal(arr,pos+1, p1)) * Number(getVal(arr,pos+2, p2));
  return 4;
};

const lessThan = (arr, pos, parsed) => {
  const { p1, p2, p3 } = parsed;
  if(getVal(arr,pos+1, p1) < getVal(arr,pos+2, p2)) {
    arr[arr[ pos + 3]] = 1;
  } else {
    arr[arr[ pos + 3]] = 0;
  }
  return 4;
};

const equals = (arr, pos, parsed) => {
  const { p1, p2, p3 } = parsed;
  if(getVal(arr,pos+1, p1) === getVal(arr,pos+2, p2)) {
    arr[arr[ pos + 3]] = 1;
  } else {
    arr[arr[ pos + 3]] = 0;
  }
  return 4;
};





// runComputer(9,[3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
//   1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
//   999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99]);
// parseOptCode('32102');
