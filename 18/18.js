const fs = require('fs');
const { getGraph } = require('./getGraph');
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
    return p
  }, 0);
  const shortCached = {};
  console.log(getShortest({v:'@', d:0}, allKeys,[], graph, shortCached));
};



const getShortest = (start, goal, keys, graph, shortCache) => {
  const cacheKey = start.v + keys.join('');
  if(shortCache[cacheKey]) return shortCache[cacheKey];

  if(keys.length === goal) {
    return 0;
  }
  let best = Infinity;
  const possible = getAvailable(start.v, keys, graph);
  for (let i = 0; i < possible.length; i++) {
    let dist = possible[i].d;
    dist += getShortest(possible[i], goal, [...keys, possible[i].v].sort(), graph, shortCache);
    if( dist < best) {
      best = dist;
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
