const fs = require('fs');
console.time("dbsave");

fs.readFile('./data.js', 'utf8', (err, data) => {
  if (err) throw err;
  const arr = data.split('\n');
  checkSum(arr);
});


const checkSum = (arr) => {
  const allOrbits = arr.reduce((dict, orb) => {
    if(!orb){
      return dict;
    }
    const two = orb.split(')');
    dict[two[1]] = two[0];
    return dict
  }, {});
  const keys = Object.keys(allOrbits);
  const total = keys.reduce((tot, current) => {
    return tot + getDistance(1, current, allOrbits)
  }, 0);
  console.log(total);
};

const getDistance = (distance, node, dict) => {
  if(dict[node] === 'COM'){
    return distance;
  }
  return getDistance(distance+1, dict[node], dict)
}
