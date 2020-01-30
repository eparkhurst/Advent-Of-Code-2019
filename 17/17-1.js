const { IntComputer } = require('./intComp');
const fs = require('fs');
console.time("dbsave");

fs.readFile('./data', 'utf8', (err, data) => {
  if (err) throw err;
  const strArr = data.split(',');
  const program = strArr.map(num => Number(num));
  getView(program);
});

const getView = (program) => {
  const comp = new IntComputer(program);
  const output = comp.runComp(0);
  const stringMap = output.reduce((map,key) =>{
    map += String.fromCharCode(key);
    return map;
  },'');

  const arrMap = stringMap.split('\n').map(line =>{
    return line.split('')
  });

  const total = getIntersections(arrMap);
  console.log(total);
  fs.writeFileSync('./map', stringMap);
};

const getIntersections = (arrMap) => {
  const checkSurroundings = (x,y) => {
    const dirs = [[x+1,y], [x-1,y], [x,y+1], [x,y-1]];
    for (let i = 0; i < dirs.length; i++){
      const dir = dirs[i];
      if(!arrMap[dir[1]] || arrMap[dir[1]][dir[0]] !=='#'){
        return 0
      }
    };
    return x * y;
  };

  let total = 0;

  for (let i = 0; i < arrMap.length; i++){
    for (let j = 0; j < arrMap[i].length; j++) {
      if(arrMap[i][j] === '#'){
        total += checkSurroundings(j,i);
      }
    }
  }
  return total
};
