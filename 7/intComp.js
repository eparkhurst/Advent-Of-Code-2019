class intComputer {
  constructor(myOutput, program, phase){
    this.phase = phase;
    this.program = [...program];
    this.n = 0;
    this.input = [];
    this.myOutput = myOutput;
    this.codeDict = {
      '01': this.add.bind(this),
      '02': this.multiply.bind(this),
      '03': this.addInput.bind(this),
      '04': this.output.bind(this),
      '05': this.jumpTrue.bind(this),
      '06': this.jumpFalse.bind(this),
      '07': this.lessThan.bind(this),
      '08': this.equals.bind(this),
    };
    this.running = true;
    this.first = true;
  }

  // let myOutput = [];
  addInput(pos) {
    this.program[this.program[pos+1]] = this.input.shift();
    return 2
  };
  output(pos, parsed) {
    const { p1 } = parsed;
    this.myOutput[0] = getVal(this.program,pos+1, p1);
    return 2
  };

  add(pos, parsed) {
    const { p1, p2 } = parsed;
    const newVal = Number(getVal(this.program,pos+1, p1)) + Number(getVal(this.program,pos+2, p2));
    this.program[this.program[ pos + 3]] = newVal;
    return 4;
  };

  equals (pos, parsed) {
    const { p1, p2, p3 } = parsed;
    if(getVal(this.program,pos+1, p1) === getVal(this.program,pos+2, p2)) {
      this.program[this.program[ pos + 3]] = 1;
    } else {
      this.program[this.program[ pos + 3]] = 0;
    }
    return 4;
  };

  multiply (pos, parsed) {
    const { p1, p2 } = parsed;
    this.program[this.program[ pos + 3]] = Number(getVal(this.program,pos+1, p1)) * Number(getVal(this.program,pos+2, p2));
    return 4;
  };

  lessThan (pos, parsed) {
    const { p1, p2, p3 } = parsed;
    if(getVal(this.program,pos+1, p1) < getVal(this.program,pos+2, p2)) {
      this.program[this.program[ pos + 3]] = 1;
    } else {
      this.program[this.program[ pos + 3]] = 0;
    }
    return 4;
  };

  jumpTrue(pos, parsed) {
    const { p1, p2 } = parsed;
    if(getVal(this.program,pos+1, p1) != 0){
      this.n = getVal(this.program,pos+2, p2);
      return 0;
    }
    return 3
  };

  jumpFalse(pos, parsed) {
    const { p1, p2 } = parsed;
    if(getVal(this.program,pos+1, p1) == 0){
      this.n = getVal(this.program,pos+2, p2);
      return 0;
    }
    return 3
  };


  runComp(input){
    if(!this.running){
      console.log('Woops');
    };
    if(this.first){
      this.input = [this.phase, ...input ];
      this.first = false;
    } else {
      this.input = input;
    }
    let t = 0;
    while(this.program[this.n] != 99 && t< 1000){
      const parsed = parseOptCode(this.program[this.n]);
      const inc = this.codeDict[parsed.optCode](this.n, parsed);
      this.n += inc;
      t++
      if(parsed.optCode === '04') break;
    }
    if(this.program[this.n] === 99) {
      this.running = false;
      this.myOutput.push('done');
    }
    return this.myOutput;
  }

};

const parseOptCode = (code) => {
  code = code + '';
  const arr = code.split('');
  const len = arr.length;
  const optCode = (arr[len-2] || '0') + arr[len-1];
  const p1 = arr[len-3] ||'0';
  const p2 = arr[len-4] ||'0';
  const p3 = arr[len-5] ||'0';
  return { optCode, p1, p2, p3 };
};

const getVal = (arr, pos, code) => {
  return code === '1' ? arr[pos]: arr[arr[pos]]
};

exports.intComputer = intComputer;
