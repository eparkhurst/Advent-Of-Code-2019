const fs = require('fs');

fs.readFile('./data.js', 'utf8', (err, data) => {
  if (err) throw err;
  const arr = data.split('\n');
  console.log(getSum(arr));
});

const getFuel = (mass) => {
  const calculated = Math.floor(mass/3) -2;
  if(calculated < 1) return 0;
  return calculated + getFuel(calculated)
};

const getSum = (arr) => {
  return arr.reduce((p, c) => {
    if (Number(c > 0)) {
      return p + getFuel(Number(c))
    }
    return p
  }, 0)
}

