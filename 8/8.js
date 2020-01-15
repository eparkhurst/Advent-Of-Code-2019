const fs = require('fs');
console.time("dbsave");

fs.readFile('./data.js', 'utf8', (err, data) => {
  if (err) throw err;
  data = data.trim();
  process(data);
});


process = (string) => {
  const split = [];
  const layerNum = string.length/150;
  for (let i=0; i < string.length; i+=150) {
    split.push(string.slice(i,i+150));
  }
  let max = {'0':150};
  const final = [];
  const map = split.reduce((allDicts, arr) => {
    const currentDict  = arr.split('').reduce((dict,c) => {
      if(!dict[c]){
        dict[c] = 1;
      }else {
        dict[c] = ++dict[c];
      }
      return dict;
    }, {})
    if (currentDict['0'] < max['0']) {
      max = currentDict;
    }
    allDicts.push(currentDict);
    return allDicts
  }, []);

  console.log(max);
  console.log(max['1']*max['2']);
};
