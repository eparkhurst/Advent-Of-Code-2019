const fs = require('fs');
console.time("dbsave");

fs.readFile('./data', 'utf-8', (err, data) => {
  if (err) throw err;
  const strArr = data.split('\n');
  const map = strArr.filter(row => row.length );
  getPath(map);
});


const getPath = (map) => {
  const portalMap = getPortalMap(map);
  console.log(portalMap);
  const startX = portalMap.AA[0][0];
  const startY = portalMap.AA[0][1];
  console.log(findShortest(startX, startY, map, portalMap));
};

const findShortest = (baseX, baseY, map, pM) => {
  const visited = [baseX+'-'+baseY];
  const queue = [{ x: baseX, y: baseY, d:0 }];
  while(queue.length){
    const n = queue.shift();
    let {x, y, d} = n;


    const dirs = [[x+1,y], [x-1,y], [x,y+1], [x,y-1]];
    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      const test = dir[0]+'-'+ dir[1];
      if(visited.includes(test)) continue;
      if(map[dir[1]] && /[\.A-Z]/.test(map[dir[1]][dir[0]])){
        if(/[A-Z]/.test(map[dir[1]][dir[0]])) {
          const pk = getGate(dir[0],dir[1],map);
          if (pk ==='ZZ') {
            return d;
          }
          if (pk ==='AA') {
            continue;
          }
          if(pM[pk][0][0] === x && pM[pk][0][1] === y){
            x = pM[pk][1][0];
            y = pM[pk][1][1];
          } else {
            x = pM[pk][0][0];
            y = pM[pk][0][1];
          }
          queue.push({x, y, d:d+1});
          visited.push(x+'-'+y)
        }else {
          queue.push({
            x:dir[0],
            y:dir[1],
            d:d+1
          });
          visited.push(dir[0]+'-'+dir[1])
        }
      }
    }
  }
  return 'not found';
};

const getPortalMap = (map) => {
  const portals = {};
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if(/[A-Z]/.test(map[y][x])){
        addToPortals(x,y,map,portals);
      }
    }
  }
  return portals;
};

const addToPortals = (x, y, map, portals) => {
  const dirs = [[x+1,y], [x-1,y], [x,y+1], [x,y-1]];
  for (let i = 0; i < dirs.length; i++){
    const dir = dirs[i];
    if(map[dir[1]] && map[dir[1]][dir[0]] === '.'){
      const key = getGate(x,y,map);
      !(key in portals) && (portals[key] = []);
      portals[key].push(dir);
    }
  }
};


const getGate = (x, y, map,) => {
  const letter = map[y][x];
  if (map[y-1] && /[A-Z]/.test(map[y-1][x])) {
    return map[y-1][x] + letter;
  }
  if (map[y+1] && /[A-Z]/.test(map[y+1][x])) {
    return letter + map[y+1][x];
  }
  if (map[y] && /[A-Z]/.test(map[y][x-1])) {
    return map[y][x-1] + letter;
  }
  if (map[y] && /[A-Z]/.test(map[y][x+1])) {
    return letter + map[y][x+1];
  }
};
