const { IntComputer } = require('./intComp');
const fs = require('fs');
console.time("dbsave");

fs.readFile('./data', 'utf8', (err, data) => {
  if (err) throw err;
  const strArr = data.split(',');
  const program = strArr.map(num => Number(num));
  fs.readFile('./map', 'utf8', (err, map) => {
    if (err) throw err;
    const arrMap = map.split('\n').map(line =>{
      return line.split('')
    });
    runProgram(arrMap, program);
    console.timeEnd("dbsave");
  });
});

const runProgram = (arrMap, program) => {
  const path = getPath(arrMap);
  const repeats = getRepeats(path);
  const routine = path.split(repeats[0]).join('A').split(repeats[1]).join('B').split(repeats[2]).join('C');
  const stuff = repeats.map(c => {
    return asciiLine(c);
  });
  const line1 =  asciiLine(routine);
  const comp = new IntComputer(program);
  const output = comp.runComp([...line1,...stuff[0], ...stuff[1], ...stuff[2], 110, 10]);
  logMap(output);
  console.log(output[output.length -1]);
};

const getPath = (arrMap) => {
  let loc = getLoc(arrMap);
  const commands = [];

  let roboDir = 'N';
  let surroundings = [];
  while (surroundings.length<2) {
    surroundings = getSurroundings(arrMap, loc, roboDir);
    const open = surroundings[0];
    if(!open){
      break;
    }
    const turn = getTurn(roboDir, open);
    commands.push(turn);
    roboDir = open;
    const count = getCount(arrMap,loc, open);
    commands.push(count);
    loc = updateLocation(loc, roboDir,count);
  }

  return commands.join('');
};

const getLoc = (arrMap) => {
  for (let i = 0; i < arrMap.length; i++){
    for (let j = 0; j < arrMap[i].length; j++) {
      if(arrMap[i][j] === '^'){
        return {
          x:j,
          y:i
        }
      }
    }
  }
};

const getSurroundings = (arrMap, loc, dir) =>{
  const { x, y } = loc;
  const hashes = [];
  if(dir === 'E' || dir === 'W'){
    if(arrMap[y+1] && arrMap[y+1][x] ==='#'){
      hashes.push('S')
    }
    if(arrMap[y-1] && arrMap[y-1][x] ==='#'){
      hashes.push('N')
    }
  } else if(dir === 'N' || dir === 'S'){
    if(arrMap[y] && arrMap[y][x+1] ==='#'){
      hashes.push('E')
    }
    if(arrMap[y] && arrMap[y][x-1] ==='#'){
      hashes.push('W')
    }
  }
  return hashes;
};

const getTurn = (dir,open) => {
  const turns = {
    N:{W:'L', E:'R'},
    S:{W:'R', E:'L'},
    E:{N:'L', S:'R'},
    W:{N:'R', S:'L'},
  };
  return turns[dir][open];
};

const getCount = (arrMap, loc, dir) => {
  let count = 0;
  let {x,y} = loc;
  /// I hate this code
  if(dir === 'N') {
    y--;
  } else if (dir === 'S') {
    y++;
  } else if (dir === 'E') {
    x++;
  } else if (dir === 'W') {
    x--;
  }
  while(arrMap[y][x]==='#'){
    count++;
    if(dir === 'N') {
      y--;
    } else if (dir === 'S') {
      y++;
    } else if (dir === 'E') {
      x++;
    } else if (dir === 'W') {
      x--;
    }
    if(!arrMap[y]) return count;
  }
  return count;
};

const updateLocation = (loc, dir, count) => {
  if(dir === 'N') {
    loc.y -= count;
  } else if (dir === 'S') {
    loc.y += count;
  } else if (dir === 'E') {
    loc.x += count;
  } else if (dir === 'W') {
    loc.x -= count;
  }
  return loc;
};

const getRepeats = (path) => {
  for (let i = 2; i < 11; i++) {
    const a = path.substring(0,i);
    const noA = path.split(a).join('');
    for (let j = 2; j < 11; j++) {
      const b = noA.substring(0,j);
      const noB = noA.split(b).join('');
      for (let k = 2; k < 11; k++) {
        const c = noB.substring(0,k);
        const noC = noB.split(c).join('');
        if (noC.length < 1) {
          return[a,b,c];
        }
      }
    }
  }
  console.log('not found');
  return [];
};

const asciiLine = (str) => {
  const arr = [];
  for (let i = 0; i <str.length; i++) {
    if(i === str.length -1){
      arr.push(str.charCodeAt(i));
      arr.push(10);
    }else{
      arr.push(str.charCodeAt(i));
      if(!isNaN(str[i]) && !isNaN(str[i+1])){

      } else {
        arr.push(44)
      }
    }
  }
  return arr;
};

const logMap = (output)=>{
  const stringMap = output.reduce((map,key) =>{
    map += String.fromCharCode(key);
    return map;
  },'');
  fs.writeFileSync('./output', stringMap);
};
