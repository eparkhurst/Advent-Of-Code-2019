const fs = require('fs');
console.time("dbsave");

fs.readFile('./map', 'utf8', (err, data) => {
  if (err) throw err;
  const map = data.split('\n');
  findSteps(map);
  console.timeEnd("dbsave");
});

const cache = {};

const findSteps = (map) => {
  const graph = getGraph(map);
  const allKeys = Object.keys(graph).reduce((p,c) => {
    if(/[a-z]/.test(c)) p++;
    return p;
  }, 0);
  const shortCached = {};
  const steps = getShortest(graph['99'], allKeys,[], graph, shortCached);
  console.log(steps);
};



const getShortest = (starts, goal, keys, graph, shortCache) => {
  const cacheKey = starts.reduce((p,c) => {return p + c.v}, '') + keys.join('');
  if(shortCache[cacheKey]) return shortCache[cacheKey];

  if(keys.length === goal) {
    return 0;
  }
  let best = Infinity;

  for (let i = 0; i < starts.length; i++) {
    const possible = getAvailable(starts[i].v, keys, graph);
    for (let j = 0; j < possible.length; j++) {
      let dist = possible[j].d;
      const nextStarts = [...starts]
      nextStarts[i] = possible[j];
      dist += getShortest(nextStarts, goal, [...keys, possible[j].v].sort(), graph, shortCache);
      if( dist < best) {
        best = dist;
      }
    }
  }
  shortCache[cacheKey] = best;
  return best;
};

const getAvailable = (start, keys, graph) => {
  const cacheKey = start+keys.join('');
  if(cache[cacheKey]) return cache[cacheKey];

  const stack = [...graph[start]];
  const toReturn = [];
  const visited = [start];
  while (stack.length > 0) {
    const current = stack.shift();
    if(visited.includes(current.v)) continue;
    visited.push(current.v);
    if(/[a-z]/.test(current.v)){
      if (!keys.includes(current.v)) {
        toReturn.push(current);
        continue;
      }
    }
    if(/[A-Z]/.test(current.v)){
      if(!keys.includes(current.v.toLowerCase())){
        continue;
      }
    }
    const next = graph[current.v];
    for (let i = 0; i < next.length; i++) {
      if(visited.includes(next[i].v)) continue;
      const toStack = {...next[i]};
      toStack.d += current.d;
      stack.push(toStack);
    }
  }
  cache[cacheKey] = toReturn;
  return toReturn;
};




const getGraph = (map) => {
  const dict = {'99': []};
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if(map[i][j] !== '#' && map[i][j] !== '.'){
        const v = map[i][j];
        if( v === '@'){
          dict['@'+dict['99'].length] = getNeighbors(j,i,map);
          dict['99'].push({ v:'@'+dict['99'].length, d:0 })
        }else{
          dict[map[i][j]] = getNeighbors(j,i,map);
        }
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
