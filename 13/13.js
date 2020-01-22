const { intComputer } = require('./intComp');
const fs = require('fs');
console.time("dbsave");

fs.readFile('./data', 'utf8', (err, data) => {
  if (err) throw err;
  const strArr = data.split(',');
  const program = strArr.map(num => Number(num));
  runGame(program);
});

let logger = false;
let paddle = 0;
let ball = 0;

const runGame = (program) => {
  const computer = new intComputer([], program, 0);
  let score = false;
  let count = 0;
  const map = [];
  let output = [];
  let after = 0;

  const cleanMap = (myMap) =>{
    return myMap.map(line =>{
      return line.join('')
    });
  }

  let joystick = 0;

  while (output){
    if(paddle<ball){
      joystick = 1;
    } else if(paddle>ball){
      joystick = -1;
    } else {
      joystick = 0;
    }
    output = computer.runComp([joystick]);
    score = drawMap(output, map);
    if(logger){
      joystick = -joystick;
      after++
      // console.log(cleanMap(map));
    }
    count ++
  }

  console.log('after', after);
  // cleanMap.join('\n');
  fs.writeFileSync('./output', cleanMap(map).join('\n'));
  return score;
};

const drawMap = (key, map) => {
  if(key[0] === -1 && key[1] === 0){
    logger = true;
    console.log('SCORE', key[2]);
    return key[2]
  }
  if(!map[key[1]]){
    map[key[1]] = []
  }
  map[key[1]][key[0]] = key[2];

  if(key[2]===4){
    ball = key[0];
    console.log('ball', key[0], key[1]);
  }
  if(key[2]===3){
    paddle = key[0];
    console.log('paddle', key[0], key[1]);
  }

  return false;
};
