

const meetsRequirements = (num) => {
  const arr = num.toString().split('');
  let double = false;
  let inARow = 0;
  let prev = -1;
  for(let i = 0; i < arr.length; i++) {
    const dig = Number(arr[i]);
    if(dig < prev){
      return false
    }
    if( dig == prev){
      inARow ++
    } else {
      if(inARow === 1){
        double = true
      }
      inARow = 0
    }
    prev = dig
  };
  if(inARow === 1){
    double = true
  }
  return double;
};

const checkAll = () => {
  let possible = 0;
  for(let i = 347312; i < 805916; i++) {
    if(meetsRequirements(i)){
      possible ++;
    }
  }
  console.log(possible);
}
checkAll();
