const { intComputer } = require('./intComp');
const fs = require('fs');

fs.readFile('./data.js', 'utf8', (err, data) => {
  if (err) throw err;
  const strArr = data.split(',');
  const program = strArr.map(num => Number(num));
  paint(program)

});

const paint = (program) => {
  const compA = new intComputer([], program, 0);
  let myOutPut = [];
  let count = 0;
  let total = 1;

  const map = {0:{0:1}};
  const bot = new robot();

  while (myOutPut && count < 1000000){
    const {x, y} = bot.location;
    if(x in map){
      if (y in map[x]) {
      }else {
        total++;
        map[x][y] = 0;
      }
    } else {
      total++;
      map[x] = {};
      map[x][y] = 0;
    }
    myOutPut = compA.runComp([map[x][y]]);
    map[x][y] = myOutPut[0];
    bot.getNewLocation(myOutPut[1]);
    count++
  }
  createMap(map);

}

class robot {
  constructor(){
    this.direction = 'up';
    this.location = {x:0, y:0};
  }

  getNewLocation(command){
    switch(this.direction){
      case 'up':
        this.direction = command ? 'right' : 'left';
        this.location.x = command ? this.location.x -1 : this.location.x +1;
        break;
      case 'down':
        this.direction = command ? 'left' : 'right';
        this.location.x = command ? this.location.x + 1 : this.location.x -1;
        break;
      case 'right':
        this.direction = command ? 'down' : 'up';
        this.location.y = command ? this.location.y -1 : this.location.y +1;
        break;
      case 'left':
        this.direction = command ? 'up' : 'down';
        this.location.y = command ? this.location.y +1 : this.location.y -1;
        break;
      default:
        break;
    }
  }
}

const createMap = (obj) => {
  const arrMap = [];
  for(let i = 0; i < 30; i++){
    arrMap.push([]);
    for(let j = 0; j < 50; j++){
      arrMap[i].push(0);
    }
  }
  const xs = Object.keys(obj);
  xs.forEach((x) => {
    Object.keys(obj[x]).forEach((y)=>{
      console.log(y);
      arrMap[Math.abs(Number(y))][Math.abs(Number(x))] = obj[x][y]
    })
  });
  fs.writeFileSync('./output', arrMap);
};
