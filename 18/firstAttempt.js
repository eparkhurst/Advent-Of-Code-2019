const fs = require('fs');
console.time("dbsave");

fs.readFile('./map', 'utf8', (err, data) => {
  if (err) throw err;
  const map = data.split('\n');
  findSteps(map);
});

const findSteps = (map) => {
  const sPoint = getLoc(map, '@');
  const root = new Node({location:{}}, sPoint, map[sPoint.y][sPoint.x]);
  root.isRoot = true;
  root.getChildren(map);

  const dict = {};
  walkTree(root, dict);
  const startingPlaces = getEnds(dict);
  console.log(dict);
  console.log(startingPlaces);
  const keys = Object.keys(dict);
  const allUpper = keys.reduce((p,k) => {
    p[k] = dict[k].filter(l => /[A-Z]/.test(l));
    return p
  }, {});
console.log(allUpper);
  let grandTotal = 0;
  startingPlaces.forEach((spot)=>{
    const path = getPath(allUpper, spot).split('').reverse();
    console.log(path);
    // const path = ['c','a','i','g','b','h'];
    let total = getPathToRoot(root, path[0]).length;
    for (let i = 0; i < path.length-1 ; i++) {
      const dist = getDistance(path[i], path[i+1], root);
      total += dist
    }
    grandTotal += total;
  })
  console.log('total', grandTotal);
};

const getLoc = (map, symbol) => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if(map[i][j] === symbol){
        return {
          y: i,
          x: j,
        }
      }
    }
  }
};

class Node {
  constructor(parent, location, value) {
    this.parent = parent;
    this.location = location;
    this.children = [];
    this.value = value;
    this.isRoot = false;
  }

  getChildren (arrMap) {
    const { x, y } = this.location;
    const dirs = [[x+1,y], [x-1,y], [x,y+1], [x,y-1]];
    for (let i = 0; i < dirs.length; i++){
      const dir = dirs[i];
      if(dir[0] === this.parent.location.x && dir[1] === this.parent.location.y){
        continue;
      }
      const value = arrMap[dir[1]][dir[0]];
      if(arrMap[dir[1]] && value){
        if(value !== '#'){
          const newNode = new Node(this, {x: dir[0], y: dir[1]}, value);
          this.children.push(newNode);
          newNode.getChildren(arrMap);
        }
      }
    }
  }
}

const walkTree = (node, dict) => {
  if(/[a-z]/.test(node.value)){
    dict[node.value] = getParents(node, []);
  }
  for (let i = 0; i < node.children.length; i++) {
    walkTree(node.children[i], dict);
  }
};

const getParents = (node, arr) => {
  if(node.parent.isRoot) return '';
  if(/[A-Za-z]/.test(node.parent.value)){
    arr.push(node.parent.value)
  }
  getParents(node.parent, arr);
  return arr;
};

const getEnds = (dict) => {
  const keys = Object.keys(dict);
  const arr = [];
  for (let i = 0; i < keys.length; i++) {
    arr.push(...dict[keys[i]].map(letter => letter.toLowerCase()))
  }
  const ends = [];
  for (let i = 0; i < keys.length; i++) {
    if(!arr.includes(keys[i])){
      ends.push(keys[i])
    }
  }
  return ends;
};

const getPath = (dict, letter) => {
  let final = letter;
  let next = letter;
  while (dict[next].length){
    final += dict[next][0].toLowerCase();
    next = dict[next][0].toLowerCase();
  }
  return final;
};


const getDistance = (a,b, root) => {
  const pathA = getPathToRoot(root, a);
  const pathB = getPathToRoot(root, b);
  let i = 0;
  while(i < pathA.length && i < pathB.length ){
    if(pathA[i] !==  pathB[i]) {
      break;
    }
    i++
  }
  return (pathA.length-i) + (pathB.length-i);
};

const getPathToRoot = (node, value) => {
  if(node.value === value){
    const path = getParentPath(node, []);
    return path;
  }
  for (let i = 0; i < node.children.length; i++) {
    const result = getPathToRoot(node.children[i], value);
    if(result) return result;
  }
  return false;
};

const getParentPath = (node, arr) => {
  if(!node.parent.isRoot){
    getParentPath(node.parent, arr);
  }
  arr.push(node);
  return arr;
};
