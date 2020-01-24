const { intComputer } = require('./intComp');
const fs = require('fs');
console.time("dbsave");

fs.readFile('./data', 'utf8', (err, data) => {
  if (err) throw err;
  const strArr = data.split(',');
  const program = strArr.map(num => Number(num));
  runSim(program);
});

let oxGen;

const runSim = (program) => {
  const comp = new intComputer(program);
  const tree = {root: new Node(null,null, false, true)};
  tree.root.getSurroundings(comp);
  getTime(oxGen);
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
};

class Node {
  constructor(parent, last, final, isRoot){
    this.isRoot = isRoot;
    this.final = final || false;
    this.parent = parent;
    this.parentDir = last;
    this.suroundings={[last]:'parent'};
    this.children = [];
  }
  isFull(){
    return Object.keys(this.suroundings).length > 3;
  }
  getSurroundings (intComp){
    for(let i =1 ; i< 5; i++){
      if(this.suroundings[i]===undefined){
        const output = intComp.runComp([i])[0];
        if(output===0){
          this.suroundings[i]=false;
        } else if(output===2){
          this.suroundings[i]=true;
          const newNode = new Node( this, getOpposite(i), true);
          this.children.push(newNode);
          oxGen = newNode;
          newNode.getSurroundings(intComp)
        }else {
          this.suroundings[i]=true;
          const newNode = new Node( this, getOpposite(i), false);
          this.children.push(newNode);
          newNode.getSurroundings(intComp)
        }
      }
    }
    if(this.isRoot){
      return;
    }
    intComp.runComp([this.parentDir]);
    return;
  };
}

const getTime = (final)=>{
  let parent = final.parent;
  let childrenToCheck = [];
  let mins = 0;
  while(childrenToCheck.length || !parent.isRoot){
    childrenToCheck = childrenToCheck.reduce((toCheck, child) =>{
      toCheck.push(...child.children);
      return toCheck
    }, []);
    if(parent.isRoot){
      console.log('hey');
    }else {
      parent.parent.children = parent.parent.children.filter(c => c!== parent);
      childrenToCheck.push(...parent.children);
      parent = parent.parent;
    }
    mins++
  }
  console.log(mins);
  return true;
};

// const checkComplete = (tree) => {
//   const toCheck = [tree.root];
//   while(toCheck.length){
//     const node = toCheck.shift();
//     if (!node.isFull()){
//       console.log(node);
//       return false;
//     }
//     toCheck.push(...node.children)
//   }
//   return true;
// };

