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
  const orderedPoints = getLOS(formatted);
  getTwoHundo(orderedPoints)

});
// const angle1 = Math.atan2(y, x) * 180 / Math.PI;

const getAngle = (a, b) => {
  return Math.atan2(b[1]-a[1], b[0] - a[0]) * 180 / Math.PI;
};

const getLOS = (array) => {
  const origin = [11,13];

  const angles = array.reduce((dict,c) => {
    let angle = getAngle(origin, c) + 90;
    if(angle < 0){
      angle = angle + 360;
    }
    const dist = getDistance(origin,c)
    if(dict[angle]){
      dict[angle].push([...c, dist])
    } else {
      dict[angle]= [angle, [...c, dist]];
    }
    return dict;
  }, {});
  const vals = Object.values(angles).sort((a,b)=>{
    return a[0] - b[0];
  });
  vals.forEach((arr)=>{
    arr.shift();
    arr.sort((a,b)=>{
      return a[3] - b[3];
    })
  })
  return vals;
};

const getDistance = (p1,p2) =>{
  const a = p1[0] - p2[0];
  const b = p1[1] - p2[1];

  return Math.sqrt( a*a + b*b );
}

const getTwoHundo = (array) => {
  let current;
  for (let i=0; i<200; i++){
    const innerArray = array[i];
    current = innerArray.shift()
  }
  console.log(current);
}

