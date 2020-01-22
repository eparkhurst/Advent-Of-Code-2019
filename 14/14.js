const _ = require('lodash');
const fs = require('fs');
console.time("dbsave");


fs.readFile('./data', 'utf8', (err, data) => {
  if (err) throw err;
  const strArr = data.trim().split('\n');
  getFuel(strArr)
  console.timeEnd("dbsave");
});


const getFuel = (rawRecipe) => {

  const map = makeMap(rawRecipe);
  let oreToUse = 1000000000000;

  let totalStock = Object.keys(map).reduce((dict, current)=>{
    if(current !== 'FUEL'){
      dict[current] = 0;
    }
    return dict
  }, {});

  const runBake = (numFuel, ore, stock) => {
    let oreUsed = ore;

    const bake = (recipe, numFuel) => {
      // numFuel = numFuel? numFuel: 1;
      const used = Object.keys(map[recipe].uses);
      const ratio = Math.ceil(numFuel/map[recipe].makes);
      const makes = Math.ceil(ratio * map[recipe].makes);

      for(let i = 0; i<used.length; i++){
        const input = used[i];
        const needs =  Math.ceil(ratio * map[recipe].uses[input]);

        if(input === 'ORE'){
          if(oreUsed < needs){
            return 0
          }
          oreUsed -= needs;
        } else if(stock[input] >= needs){
          stock[input] -= needs;
        } else {
          const nextAmnt = bake(input, needs);
          if(nextAmnt < 1) return 0;
          stock[input] =  stock[input] + nextAmnt;
          stock[input] -= needs;
        }
      }

      return makes;
    };

    const result = bake('FUEL', numFuel);
    if(result > 0){
      return {
        oreChange: ore - oreUsed,
        stock,
        amount: result,
      };
    }
    return false;
  };

  let total = 0;
  let i = 0;

  const testFuel = (num) => {
    while(i<1000000000){
      const output = runBake(num, oreToUse, totalStock);
      if(!output) {
        break;
      }
      if(output.amount !== num){
        console.log('hit');
      }
      oreToUse -= output.oreChange;
      totalStock = output.stock;
      total += num;
      i++;
    }
  };

  let fuelToTest = 1000000;
  while(fuelToTest >= 1){
    testFuel(fuelToTest);
    fuelToTest = fuelToTest/10
  }

  // testFuel(1);

  console.log(oreToUse);
  console.log(total);
};


const makeMap = (recipe) => {
  return recipe.reduce((map, eq) =>{
    const sides = eq.split('=>');
    const result = sides[1].trim().split(' ');
    const uses = sides[0].trim().split(',');
    map[result[1]] = { makes: Number(result[0]), uses: {}};
    uses.forEach(quant => {
      const unit = quant.trim().split(' ');
      map[result[1]].uses[unit[1]] = Number(unit[0]);
    });
    return map
  }, {});
}

// Goal 82892753
// 1993285 too high
