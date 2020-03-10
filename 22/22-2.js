const fs = require('fs');

fs.readFile('./data', 'utf8', (err, data) => {
  if (err) throw err;
  const strArr = data.trim().split('\n');
  // shuffle(strArr);
  // console.log(cut(7,10,-4));
});

const shuffle = (commands) => {
  const deckCount = 119315717514047;
  let location = 2020;
  let last = location;
  const allLocs = [];
  for (let j = 0; j < 420900; j++) {
    for (let i = 0; i < commands.length; i++) {
      if(commands[i] === 'deal into new stack'){
        location = deckCount - 1 - location;
      } else if(commands[i].includes('deal with increment')){
        const num = Number(commands[i].split(' ').pop());
        location = (location * num) % deckCount;
      } else if(commands[i].includes('cut')){
        const num = Number(commands[i].split(' ').pop());
        location = cut(location, deckCount, num);
      }
    }
    const diff = location - last;
    if (allLocs.includes(diff)){
      console.log(j);
      return
    }
    allLocs.push(diff);
    last = location
  }
  console.log('finished');
};


const cut = (loc, deckCount, num) => {
  if (num > 0) {
    if(loc < num){
      return deckCount - (num - loc);
    }
    return loc - num;
  }
  if(loc >= (deckCount + num)){
    return Math.abs(num) - (deckCount - loc);
  }
  return loc + Math.abs(num);
};
