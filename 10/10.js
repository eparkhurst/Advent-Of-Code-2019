const fs = require('fs');

fs.readFile('./data.js', 'utf8', (err, data) => {
  if (err) throw err;
  const lineArray = data.trim().split('\n');
  const formatted = lineArray.reduce((p, line, y) =>{
    const arr = line.trim().split('');
    for(let i = 0; i < arr.length; i++){
      if(arr[i] === '#')
      p.push([i,y]);
    }
    return p
  }, []);
  getLOS(formatted);

});
// const angle1 = Math.atan2(y, x) * 180 / Math.PI;

const getAngle = (a, b) => {
  return Math.atan2(b[1]-a[1], b[0] - a[0]) * 180 / Math.PI;
};

const getLOS = (array) => {
  let location = []
  const stuff = array.reduce((max, node, i, map) => {
    const angles = map.reduce((dict,c) => {
      const angle = getAngle(node, c);
      console.log(angle);
      dict[angle] = true;
      return dict;
    }, {})
    if(Object.keys(angles).length> max){
      location = node
      max = Object.keys(angles).length;
    }
    return max
  }, 0);
  console.log(location);
  console.log(stuff);
};

// console.log(getAngle([0,0], [2,2]));
// console.log(getAngle([0,0], [3,3]));
// console.log(getAngle([3,3], [0,0]));
