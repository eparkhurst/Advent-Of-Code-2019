const fs = require('fs');

fs.readFile('./data', 'utf8', (err, data) => {
  if (err) throw err;
  const strArr = data.trim().split('\n');
  const map = strArr.map(ln => ln.split(''));
  run(map);
});

const run = (map) => {
  let nextMap = map;
  const mapArray = [];
  while(true) {
    nextMap = getNextMap(nextMap);
    const flatMap = nextMap.join('');
    if(mapArray.includes(flatMap)){
      console.log(getBioDiversity(nextMap));
      return 'yay'
    };
    mapArray.push(flatMap);
  }
};

const getNextMap = (map) => {
  const nextMap = [[],[],[],[],[]];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      nextMap[y][x] = getNextVal(x,y,map);
    }
  }
  return nextMap
};

const getNextVal = (x,y, map) => {
  let totalNeighbors = 0;
  const dirs = [
    { x: x+1, y },
    { x: x-1, y },
    { x, y: y+1 },
    { x, y: y-1 }
    ];
  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];
    if(map[dir.y] && map[dir.y][dir.x]){
      if( map[dir.y][dir.x] === '#'){
        totalNeighbors ++;
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

const getBioDiversity = (map) => {
  let multiplier = 1;
  let total = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if(map[i][j] === '#'){
        total += multiplier;
      }
      multiplier = multiplier * 2;
    }
  }
  return total;
};
