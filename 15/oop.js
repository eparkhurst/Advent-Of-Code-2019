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
  const tree = {root: new Node(0,0,null,1)};
  let currentLoc = { x:0, y:0 };

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

  let currentNode = tree.root;
  let backTracking = false;

  while(output !== 2 && n< 10000) {
    output = comp.runComp([dir])[0];
    if(output === 2){
      const newNode = new Node(currentLoc.x, currentLoc.y, currentNode, getOpposite(dir), true);
      currentNode.children.push(newNode);
      currentNode=newNode;
    } else if (output === 1){
      currentNode.suroundings[dir]=true;
      currentLoc = updateLoc(dir);
      if(!backTracking){
        const newNode = new Node(currentLoc.x, currentLoc.y, currentNode, getOpposite(dir));
        currentNode.children.push(newNode);
        currentNode = newNode;
        dir = currentNode.getNextDir()
      } else {
       currentNode = currentNode.parent;
       if(!currentNode.isFull()) backTracking = false;
       dir = currentNode.getNextDir();
      }
    } else {
      currentNode.suroundings[dir]=false;
      if(currentNode.isFull()){
        backTracking = true;
        dir = currentNode.parentDir;
      }else{
        dir = currentNode.getNextDir();
      }
    }
    n++;
  }
  //#### For Shortest Distance

  // let distance = 0;
  // while(currentNode.parent && distance < n){
  //   currentNode = currentNode.parent
  //   distance++
  // }
  // console.log(distance);
};

const getOpposite = (dir) => {
  switch(dir) {
    case 1:
      return 2;
    case 2:
      return 1;
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
  constructor(x,y,parent, last, final){
    this.final = final || false;
    this.location = {x,y};
    this.parent = parent;
    this.parentDir = last;
    this.suroundings={[last]:'parent'};
    this.children = [];
  }
  isFull(){
    return Object.keys(this.suroundings).length === 4;
  }
  getNextDir(){
    for (let i=1; i<5; i++){
      if(this.suroundings[i] === undefined){
        return i;
      }
    }
    return this.parentDir;
  }
}
