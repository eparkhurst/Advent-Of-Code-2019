const { intComputer } = require('./intComp');
const fs = require('fs');
console.time("dbsave");

fs.readFile('./data', 'utf8', (err, data) => {
  if (err) throw err;
  const strArr = data.split(',');
  const program = strArr.map(num => Number(num));
  runSim(program);
});

const runSim = (program) => {
  const comp = new intComputer(program);

  let output = 0;
  let n = 0;
  let dir = 1;
  const past = [];
  let isRight = true;
  const map = {0:{0:{ type: true, searched:false }}};
  let currentLoc = {x:0,y:0};
  let lastLoc = {x:0,y:0};


  const updateLoc = (dir) => {
    const attempt = {...currentLoc};
    switch(dir) {
      case 1:
        attempt.y = currentLoc.y + 1;
        break;
      case 2:
        attempt.y = currentLoc.y - 1;
        break;
      case 3:
        attempt.x = currentLoc.x - 1;
        break;
      case 4:
        attempt.x = currentLoc.x + 1;
        break;
      default:
        console.log('ERROR');
        break;
    }
    return attempt;
  };

  const updateMap = (attempt, hit) => {
    if (map[attempt.x]) {
      if(map[attempt.x][attempt.y]){
        map[attempt.x][attempt.y].type = hit;
      }else {
        map[attempt.x][attempt.y] = { type:hit, searched: false };
      }
    } else {
      map[attempt.x] = {[attempt.y]: { type:hit, searched: false }};
    }
  };

  const checkLast = (dir) => {
    if(map[lastLoc.x][lastLoc.y].searched){
      return true;
    }
    try{
      if(
        map[lastLoc.x+1][lastLoc.y] &&
        map[lastLoc.x-1][lastLoc.y] &&
        map[lastLoc.x][lastLoc.y+1] &&
        map[lastLoc.x][lastLoc.y-1]
      ){
        map[lastLoc.x][lastLoc.y].searched = true;
        return true;
      }
    } catch (e) {
      map[lastLoc.x][lastLoc.y].next = dir;
      return false;
    }
    return false;
  };


  while(output !== 2 && n< 50) {
    output = comp.runComp([dir])[0];
    const attempt = updateLoc(dir);
    if(output === 0){
       updateMap(attempt, false);
      if(past[past.length-1] === 1){
        isRight = !isRight;
      }
    }else if (output === 1) {
      updateMap(attempt, true);
      if(!checkLast(dir)){
        dir = getOpposite(dir);
      };
      lastLoc = currentLoc;
      currentLoc = attempt;
    }else if(output === 2){
      console.log('Got It!!!');
    }
    dir = isRight ? turnRight(dir) : turnLeft(dir);
    past.push(output);
    n++;
  }
  console.log(map);
  console.log(n);
};

const turnRight = (cur) => {
  const dirs = [1,4,2,3];
  if(dirs.indexOf(cur)===3){
    return dirs[0]
  };
  return dirs[dirs.indexOf(cur)+1];
};

const turnLeft = (cur) => {
  const dirs = [1,4,2,3];
  if(dirs.indexOf(cur)===0){
    return dirs[3]
  };
  return dirs[dirs.indexOf(cur)-1];
};

const getOpposite = (dir) => {
  switch(dir) {
    case 1:
      return 2;
    case 2:
      return ;
    case 3:
      return 4;
    case 4:
      return 3;
    default:
      console.log('ERROR');
      return;
  }
}

class Node {
  constructor(x,y,parent, last){
    this.location = {x,y};
    this.parent = parent;
    this.checked=[last]
  }
  isFull(){
    return this.checked.length === 4
  }
}
