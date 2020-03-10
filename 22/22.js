const fs = require('fs');

fs.readFile('./data', 'utf8', (err, data) => {
  if (err) throw err;
  const strArr = data.trim().split('\n');
  shuffle(strArr)
});

const shuffle = (commands) => {
  let deck = getDeck(10007);
  for (let i = 0; i < commands.length; i++) {
    if(commands[i] === 'deal into new stack'){
      deck.reverse();
    } else if(commands[i].includes('deal with increment')){
      const num = Number(commands[i].split(' ').pop());
      deck = increment(deck, num);
    } else if(commands[i].includes('cut')){
      const num = Number(commands[i].split(' ').pop());
      deck = cut(deck, num);
    }
  }
  console.log(deck.indexOf(2019));
};

const getDeck = (num) => {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(i);
  }
  return arr;
};

const increment = (arr, num) => {
  let loc = 0;
  const newDeck = [];
  for (let i = 0; i < arr.length; i++) {
    newDeck[loc] = arr[i];
    loc += num;
    if(loc > arr.length){
      loc = loc - arr.length;
    }
  }
  return newDeck
};

const cut = (arr, num) => {
  if (num > 0) {
    return [...arr.slice(num),...arr.slice(0,num)]
  }
  return [...arr.slice(arr.length + num),...arr.slice(0, arr.length +num)]
};
