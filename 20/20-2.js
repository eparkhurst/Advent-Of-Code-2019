const fs = require('fs');
console.time("dbsave");

fs.readFile('./data', 'utf-8', (err, data) => {
  if (err) throw err;
  const strArr = data.split('\n');
  const map = strArr.filter(row => row.length );
  getPath(map);
});


const getPath = (map) => {
  const graph = getGraph(map);
  console.log(graph);
  console.log(findShortest('AAO', graph));
  console.timeEnd("dbsave");
};


const getGraph = (map) => {
  const dict = {};
  for (let y = 1; y < map.length-1; y++) {
    for (let x = 1; x < map[y].length; x++) {
      if (/[A-Z]/.test(map[y][x])) {
        const gate = getGate(x, y, map);
        if(gate){
          dict[gate] = getNeighbors(x, y, map);
        }
      }
    }
  }
  return dict;
};

const getNeighbors = (x,y,map) => {
  const otherGate = getGate(x,y,map, true);
  let found;
  if(otherGate === 'AAI' || otherGate === 'ZZI'){
    found = [];
  } else {
    found = [{v:otherGate, d:1}];
  }
  const queue = [getFirst(x,y,map)];
  const visited = {[x]:{[y]:true}};

  while(queue.length) {
    const next = queue.shift();
    if(visited[next.x] && visited[next.x][next.y]) continue;
    if(visited[next.x]){
      visited[next.x][next.y] = true;
    } else {
      visited[next.x] = {[next.y]: true}
    }
    const cell = map[next.y][next.x];
    if(/[A-Z]/.test(cell)) {
      found.push({v: getGate(next.x, next.y, map), d: next.d -1})
    } else{
      queue.push(...getDirectNeighbors(next, map, ++next.d, visited))
    }
  }
  return found;
};

const getDirectNeighbors = (node, map, d, visited) => {
  const {x, y} = node;
  const dirs = [[x+1,y], [x-1,y], [x,y+1], [x,y-1]];
  const neighbors = [];
  for (let i = 0; i < dirs.length; i++){
    const dir = dirs[i];
    if(visited[dir[0]] && visited[dir[0]][dir[1]]) {
      continue
    }
    if(map[dir[1]] && map[dir[1]][dir[0]]){
      if(/[A-Z\.]/.test(map[dir[1]][dir[0]])){
        neighbors.push({x: dir[0], y: dir[1], d})
      }
    }
  }
  return neighbors;
};

const getGate = (x, y, map, inverse) => {
  const exists = getFirst(x,y,map);
  if (!exists) return false;

  const letter = map[y][x];
  let loc = inverse ? 'I' : 'O';
  if(x>1 && x < (map[2].length -2) && y > 1 && y < (map.length -2)){
    loc = inverse ? 'O' : 'I'
  }
  if (map[y-1] && /[A-Z]/.test(map[y-1][x])) {
    return map[y-1][x] + letter + loc;
  }
  if (map[y+1] && /[A-Z]/.test(map[y+1][x])) {
    return letter + map[y+1][x] + loc;
  }
  if (map[y] && /[A-Z]/.test(map[y][x-1])) {
    return map[y][x-1] + letter + loc;
  }
  if (map[y] && /[A-Z]/.test(map[y][x+1])) {
    return letter + map[y][x+1] + loc;
  }
};

const getFirst = (x, y, map) => {
  const dirs = [[x+1,y], [x-1,y], [x,y+1], [x,y-1]];
  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];
    if(map[dir[1]][dir[0]] === '.'){
      return {x:dir[0], y: dir[1], d: 0};
    }
  }
  return false
};


const findShortest = (start, graph,) => {
  const visited = { };
  const queue = [{loc: 'AAO', d:0, level:0 }];
  while(queue.length){
    if (queue.length > 10000) {
      return 'Boo'
    }
    const current = queue.shift();
    if(current.loc === 'ZZO' && current.level === 0){
      return current.d;
    }
    if(visited[current.loc + current.level] < current.d) continue;
    if(current.level===0 && current.loc !== 'AAO' && current.loc[2] === 'O') continue;
    visited[current.loc + current.level] = current.d;

    for (let i = 0; i < graph[current.loc].length; i++) {
      if (visited[current.loc + current.level] < graph[current.loc][i]) {
        continue;
      }
      queue.push({
          loc: graph[current.loc][i].v,
          d: current.d + graph[current.loc][i].d,
          level: current.level + getLevelChange(current.loc, graph[current.loc][i].v),
        }
      )
    }
  }
  return 'Womp Womp';
};

const getLevelChange = (start, end) => {
  if(start[0]===end[0] && start[1] === end[1]){
    return start[2] === 'O' ? -1 : 1;
  }
  return 0;
};
