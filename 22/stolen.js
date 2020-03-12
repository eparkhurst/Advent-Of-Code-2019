const fs = require('fs');

fs.readFile('./data', 'utf8', (err, data) => {
  if (err) throw err;
  const strArr = data.trim().split('\n');
  console.log(solve3(strArr, 119315717514047, 2020, 101741582076661));
});



function solve3(input, N, x, rep = 1) {
  let [a, b] = input.reduceRight(([a, b], line) => {
    if(line === 'deal into new stack'){
      return [(N - a) % N, (N + N - b - 1) % N];
    } else if(line.includes('deal with increment')){
      const num = Number(line.split(' ').pop());
      return  [modDiv(a, num, N), modDiv(b, num, N) ]
    } else if(line.includes('cut')){
      const num = Number(line.split(' ').pop());
      return [ a, ((b + num) %N + N )% N];
    }
    return [1,0];
    }, [1, 0]);
  console.log(a,b);
  while (rep) {
    if (rep % 2) x = (mulMod(x,a,N) + b) % N;
    [a, b] = [mulMod(a,a,N), (mulMod(a,b,N) + b) % N];
    rep = Math.floor(rep / 2);
  }
  return x;
}


function gcdExtended(a, b) {
  let x = 0, y = 1, u = 1, v = 0;
  while (a !== 0) {
    let q = Math.floor(b / a);
    [x, y, u, v] = [u, v, x - u * q, y - v * q];
    [a, b] = [b % a, a];
  }
  return [b, x, y];
}
function modInverse(a, m) {
  const [g, x] = gcdExtended(a, m);
  if (g !== 1) throw('Bad mod inverse')
  return (x + m) % m;
}
function modDiv(a, b, m) {
  return Number(BigInt(a) * BigInt(modInverse(b, m)) % BigInt(m));
}
function mulMod(a,b,m) {
  return Number(BigInt(a) * BigInt(b) % BigInt(m))
}

// [/new stack/, () => [(N - a) % N, (N + N - b - 1) % N]],
//   [/increment (\S+)/, aa => [ modDiv(a, aa, N), modDiv(b, aa, N) ]],
//   [/cut (\S+)/, bb => [ a, ((b + bb) %N + N )% N] ],
// )

// 4630393527968 too low
