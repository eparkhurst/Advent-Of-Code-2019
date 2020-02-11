const getGraph = (map) => {
  const dict = {};
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if(map[i][j] !== '#' && map[i][j] !== '.'){
        const v = map[i][j];
        dict[map[i][j]] = getNeighbors(j,i,map);
      }
    }
  }
  return dict;
};

const getNeighbors = (x, y, arrMap) => {
  const location = {x,y};
  const visited = {[x]:{[y]:true}};
  const found = [];

  const queue = getDirectNeighbors(location, arrMap, 1, visited).map(node => {
    return node;
  });
  while(queue.length) {
    const next = queue.shift();
    if(visited[next.x] && visited[next.x][next.y]) continue;
    if(visited[next.x]){
      visited[next.x][next.y] = true;
    } else {
      visited[next.x] = {[next.y]: true}
    }
    const cell = arrMap[next.y][next.x];
    if(/[A-Za-z]/.test(cell)) {
      found.push({v: cell, d: next.d})
    } else{
      queue.push(...getDirectNeighbors(next,arrMap, ++next.d, visited))
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
      if(map[dir[1]][dir[0]] !== '#'){
        neighbors.push({x: dir[0], y: dir[1], d})
      }
    }
  }
  return neighbors;
};

exports.getGraph = getGraph;
