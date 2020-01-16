const fs = require('fs');

let match = 99999999999999;
let firstTotal = 0;
let secondTotal = 0;

fs.readFile('./data.js', 'utf8', (err, data) => {
  if (err) throw err;
  const arr = data.split('\n');
  const first = arr[0].split(',');
  const second = arr[1].split(',');

  const firstMap = mapPath(first);
  checkPath(firstMap, second);
  console.log(match);
});



const mapPath = (arr) => {
  let map = {0:{0:0}};
  currentPos = {
    x:0,
    y:0,
  };
  arr.forEach((dir, i) =>{
    switch(dir[0]){
      case 'R':
        iterate(map, Number(dir.substring(1)), currentPos, rFunc);
        currentPos.x = currentPos.x + Number(dir.substring(1));
        break;
      case 'L':
        iterate(map, Number(dir.substring(1)), currentPos, lFunc);
        currentPos.x = currentPos.x - Number(dir.substring(1));
        break;
      case 'U':
        iterate(map, Number(dir.substring(1)), currentPos, uFunc);
        currentPos.y = currentPos.y + Number(dir.substring(1));
        break;
      case 'D':
        iterate(map, Number(dir.substring(1)), currentPos, dFunc);
        currentPos.y = currentPos.y - Number(dir.substring(1));
        break;
      default:
        console.log('Broken');
        break;
    }
  });
  return map;
};

iterate = (map, distance, pos, func) => {
  const { x, y } = pos;
  for(let i = 1; i <= distance; i++){
    firstTotal = firstTotal + 1;
    func(map,x,y, i)
  }
};

rFunc = (map, x, y, i) => {
  if(map[x+i] && map[x+i][y]){

  } else {
    map[x+i] = {...map[x+i], [y]:firstTotal};
  }
};

lFunc = (map, x, y, i) => {
  if(map[x-i] && map[x-i][y]){

  } else {
    map[x-i] = {...map[x-i], [y]:firstTotal};
  }
};

uFunc = (map, x, y, i) => {
  if(map[x] && map[x][y+i]){

  } else {
    map[x] = {...map[x], [y+i]:firstTotal};
  }
};

dFunc = (map, x, y, i) => {
  if(map[x] && map[x][y-i]){

  } else {
    map[x] = {...map[x], [y-i]:firstTotal}
  }

};

checkR = (map, x, y, i) => {
  secondTotal++;
  if( map[x+i] && map[x+i][y] ){
    const distance =  map[x+i][y] + secondTotal;
    if(distance < match){
      console.log(distance, secondTotal);
      match = distance;
    }
  }
};
checkL = (map, x, y, i) => {
  secondTotal++;
  if( map[x-i] && map[x-i][y] ){
    const distance = map[x-i][y] + secondTotal;
    if(distance < match){
      console.log(distance, secondTotal);
      match = distance;
    }
  }
};
checkU = (map, x, y, i) => {
  secondTotal++;
  if( map[x] && map[x][y+i] ){
    const distance = map[x][y+i] + secondTotal;
    if(distance < match){
      console.log(distance, secondTotal);
      match = distance;
    }
  }
};
checkD = (map, x, y, i) => {
  secondTotal++;
  if( map[x] && map[x][y-i] ){
    const distance = map[x][y-i] + secondTotal;
    if(distance < match){
      console.log(distance, secondTotal);
      match = distance;
    }
  }
};

const checkPath = ( map, arr) => {
  const currentPos = {
    x:0,
    y:0,
  };
  arr.forEach((dir) =>{
    switch(dir[0]){
      case 'R':
        iterate(map, Number(dir.substring(1)), currentPos, checkR);
        currentPos.x = currentPos.x + Number(dir.substring(1));
        break;
      case 'L':
        iterate(map, Number(dir.substring(1)), currentPos, checkL);
        currentPos.x = currentPos.x - Number(dir.substring(1));
        break;
      case 'U':
        iterate(map, Number(dir.substring(1)), currentPos, checkU);
        currentPos.y = currentPos.y + Number(dir.substring(1));
        break;
      case 'D':
        iterate(map, Number(dir.substring(1)), currentPos, checkD);
        currentPos.y = currentPos.y - Number(dir.substring(1));
        break;
    }
  });
}

// const firstMap = mapPath(['R75','D30','R83','U83','L12','D49','R71','U7','L72']);
// checkPath(firstMap, ['U62','R66','U55','R34','D71','R55','D58','R83']);

// const firstMap = mapPath(['R98','U47','R26','D63','R33','U87','L62','D20','R33','U53','R51']);
// checkPath(firstMap, ['U98','R91','D20','R16','D67','R40','U7','R15','U6','R7']);

// const firstMap = mapPath(['R8','U5','L5','D3']);
// checkPath(firstMap, ['U7','R6','D4','L4']);
