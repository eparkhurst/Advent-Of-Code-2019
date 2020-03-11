const fs = require('fs');

fs.readFile('./data', 'utf8', (err, data) => {
  if (err) throw err;
  const strArr = data.trim().split('\n');
  const map = strArr.map(ln => ln.split(''));
  run(map);
});

const run = (map) => {
  console.log(map);
  let universe = {
    '-1': getBlankMap(),
    0: map,
    1: getBlankMap(),
  };

  for (let i = 0; i < 200; i++) {
    const nextUniverse = {};
    Object.keys(universe).forEach(level =>{
      nextUniverse[level] = getNextMap(universe, Number(level));
    });
    universe = Object.assign({}, universe, nextUniverse);
  }
  console.log(getTotal(universe));
};

const getNextMap = (universe, level) => {
  const map = universe[level];
  const nextMap = [[],[],[],[],[]];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if(x === 2 && y === 2){
        nextMap[y][x] = '?';
        continue;
      }
      nextMap[y][x] = getNextVal(x,y, universe, level);
    }
  }
  return nextMap
};

const getNextVal = (x,y, universe, level) => {
  if(level === 1 && x===4 && y === 4){
    const j = 'hey'
  }
  const map = universe[level];
  let totalNeighbors = 0;
  const dirs = [
    { x: x+1, y },
    { x: x-1, y },
    { x, y: y+1 },
    { x, y: y-1 }
  ];
  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];
    if(dir.x === 2 && dir.y === 2){
      totalNeighbors += getInnerVals(x,y,universe, level)
    }
    if(map[dir.y] && map[dir.y][dir.x]){
      if( map[dir.y][dir.x] === '#'){
        totalNeighbors ++;
      }
    } else {
      if(!universe[level-1]){
        universe[level-1] = getBlankMap()
      } else {
        const x = getX(dir.x, dir.y);
        const y = getY(dir.x, dir.y);
        if(universe[level-1][y][x] === '#'){
          totalNeighbors ++;
        }
      }
    }
  }
  if(map[y][x] === '#' && totalNeighbors === 1){
    return '#';
  }
  if(map[y][x] === '.' && (totalNeighbors === 1 || totalNeighbors === 2 )){
    return '#';
  }
  return '.';
};

const getBlankMap = () =>{
  const blankMap = [];
  for (let i = 0; i < 5; i++) {
    blankMap[i] = ['.', '.', '.', '.', '.'];
  }
  return blankMap;
};

const getX = (x, y) => {
  if(y < 0 || y > 4){
    return 2;
  }
  if(x === -1) return 1;
  return 3
};

const getY = (x, y) => {
  if(x < 0 || x > 4){
    return 2;
  }
  if(y === -1) return 1;
  return 3
};

const getInnerVals = (x,y,universe, level) =>{
  if(!universe[level+1]){
    universe[level + 1] = getBlankMap();
    return 0;
  }
  const innerMap = universe[level + 1];
  if(x === 1){
    return innerMap.reduce((p,c) => {
      if(c[0]==='#') p++;
      return p
    }, 0)
  }
  if(x === 3){
    return innerMap.reduce((p,c) => {
      if(c[4] === '#') p++;
      return p
    }, 0)
  }
  if(y === 1){
    return innerMap[0].reduce((p,c) => {
      if(c === '#') p++;
      return p
    }, 0)
  }
  if(y === 3){
    return innerMap[4].reduce((p,c) => {
      if(c === '#') p++;
      return p
    }, 0)
  }
};

const getTotal = (universe) => {
  let total = 0;
  Object.keys(universe).forEach(level =>{
    total += universe[level].reduce((p,c) => {
      const num = c.reduce((n,r) =>{
        if(r === '#') n++
        return n;
      }, 0);
      return p + num;
    }, 0)
  });
  return total;
}
