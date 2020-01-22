const fs = require('fs');
console.time("dbsave");

class Moon {
  constructor(x,y,z){
    this.location = {x,y,z};
    this.velocity = {
      x:0,
      y:0,
      z:0,
    }
  }
  updateLocation(){
    this.location.x += this.velocity.x;
    this.location.y += this.velocity.y;
    this.location.z += this.velocity.z;
  }
  getMoonEnergy(){
    const pot = Math.abs(this.location.x) + Math.abs(this.location.y) + Math.abs(this.location.z);
    const kin = Math.abs(this.velocity.x) + Math.abs(this.velocity.y) + Math.abs(this.velocity.z);
    return pot * kin;
  }
}


const combine = (arr) => {
  for (let i = 0; i<arr.length-1; i++){
    for (let j = i+1; j<arr.length; j++){
      updateVelocities(arr[i], arr[j]);
    }
  }
};

const runSimulation = () => {
  const moonA = new Moon(12,0,-15);
  const staticA = new Moon(12,0,-15);
  const moonB = new Moon(-8,-5,-10);
  const staticB = new Moon(-8,-5,-10);
  const moonC = new Moon(7,-17,1);
  const staticC = new Moon(7,-17,1);
  const moonD = new Moon(2,-11,-6);
  const staticD = new Moon(2,-11,-6);

  // const moonA = new Moon(-8,-10,0);
  // const staticA = new Moon(-8,-10,0);
  //
  // const moonB = new Moon(5,5,10);
  // const staticB = new Moon(5,5,10);
  //
  // const moonC = new Moon(2,-7,3);
  // const staticC = new Moon(2,-7,3);
  //
  // const moonD = new Moon(9,-8,-3);
  // const staticD = new Moon(9,-8,-3);

  // const moonA = new Moon(-1,0,2);
  // const staticA = new Moon(-1,0,2);
  //
  // const moonB = new Moon(2,-10,-7);
  // const staticB = new Moon(2,-10,-7);
  //
  // const moonC = new Moon(4,-8,8);
  // const staticC = new Moon(4,-8,8);
  //
  // const moonD = new Moon(3,5,-1);
  // const staticD = new Moon(3,5,-1);

  const allMoons = [moonA ,moonB, moonC, moonD];
  const staticMoons = [staticA, staticB, staticC, staticD];

  const mins = getMatch(allMoons, staticMoons);

  const first = lcm_two_numbers(mins[0], mins[1]);
  console.log(lcm_two_numbers(first, mins[2]));

};

const getMatch = (allMoons, staticMoons) => {
  let count = 1;
  let stillX = true;
  let stillY = true;
  let stillZ = true;
  const arr = [];
  while (stillX || stillY || stillZ){
    combine(allMoons);
    allMoons.forEach(moon =>{
      moon.updateLocation();
    });

    if(stillX && checkMatch(allMoons, staticMoons, 'x' )) {
      stillX = false;
      arr.push(count)
    }
    if(stillY && checkMatch(allMoons, staticMoons, 'y' )) {
      stillY = false;
      arr.push(count)
    }
    if(stillZ && checkMatch(allMoons, staticMoons, 'z' )) {
      stillZ = false;
      arr.push(count)
    }
    count ++
  }
  return arr;
}

const updateVelocities = (moon1, moon2) => {
  ['x','y','z'].map(coord => {
    if (moon1.location[coord] > moon2.location[coord]) {
      moon1.velocity[coord] -= 1;
      moon2.velocity[coord] += 1;
    }else if(moon1.location[coord] < moon2.location[coord]) {
      moon1.velocity[coord] += 1;
      moon2.velocity[coord] -= 1;
    }
  })
};

const checkMatch = (arr1, arr2, dir) => {
  for (let i = 0; i < arr1.length; i++){
    if(arr1[i].location[dir] !== arr2[i].location[dir]) return false;
    if(arr1[i].velocity[dir] !== arr2[i].velocity[dir]) return false;
  }
    return true;
};


const lcm_two_numbers = (x, y) => {
  if ((typeof x !== 'number') || (typeof y !== 'number'))
    return false;
  return (!x || !y) ? 0 : Math.abs((x * y) / gcd_two_numbers(x, y));
};

const gcd_two_numbers = (x, y) => {
  x = Math.abs(x);
  y = Math.abs(y);
  while(y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
};


runSimulation();
