class IntComputer {
  constructor(program){
    this.program = [...program];
    this.n = 0;
    this.relativeBase = 0;
    this.input = [];
    this.myOutput = [];
    this.codeDict = {
      '01': this.add.bind(this),
      '02': this.multiply.bind(this),
      '03': this.addInput.bind(this),
      '04': this.output.bind(this),
      '05': this.jumpTrue.bind(this),
      '06': this.jumpFalse.bind(this),
      '07': this.lessThan.bind(this),
      '08': this.equals.bind(this),
      '09': this.adjustBase.bind(this),
    };
    this.running = true;
    this.first = true;
  }

  // let myOutput = [];
  addInput(pos, parsed) {
    const {p1} = parsed;
    if(p1 === '2'){
      this.program[this.relativeBase + this.program[pos+1]] = this.input.shift();
    } else {
      this.program[this.program[pos+1]] = this.input.shift();
    }
    return 2
  };
  output(pos, parsed) {
    const { p1 } = parsed;
    this.myOutput.push(this.getVal(this.program,pos+1, p1));
    return 2
  };

  adjustBase(pos, parsed) {
    const {p1} = parsed;
    this.relativeBase = this.relativeBase +this.getVal(this.program,pos+1, p1);
    return 2
  };

  add(pos, parsed) {
    const { p1, p2, p3 } = parsed;
    const newVal = Number(this.getVal(this.program,pos+1, p1)) + Number(this.getVal(this.program,pos+2, p2));
    if(p3 === '2'){
      this.program[this.relativeBase + this.program[pos+3]] = newVal;
    } else {
      this.program[this.program[ pos + 3]] = newVal;
    }
    return 4;
  };

  equals (pos, parsed) {
    const { p1, p2, p3 } = parsed;
    if(this.getVal(this.program,pos+1, p1) === this.getVal(this.program,pos+2, p2)) {
      if(p3 === '2'){
        this.program[this.relativeBase + this.program[pos+3]] = 1
      } else {
        this.program[this.program[ pos + 3]] = 1;
      }
    } else {
      if(p3 === '2') {
        this.program[this.relativeBase + this.program[pos+3]] = 0
      }else {
        this.program[this.program[ pos + 3]] = 0;
      }
    }
    return 4;
  };

  multiply (pos, parsed) {
    const { p1, p2, p3 } = parsed;
    const newVal = Number(this.getVal(this.program,pos+1, p1)) * Number(this.getVal(this.program,pos+2, p2));
    if(p3 === '2'){
      this.program[this.relativeBase + this.program[pos+3]] = newVal;
    } else {
      this.program[this.program[ pos + 3]] = newVal;
    }
    return 4;
  };

  lessThan (pos, parsed) {
    const { p1, p2, p3 } = parsed;
    if(this.getVal(this.program,pos+1, p1) < this.getVal(this.program,pos+2, p2)) {
      if(p3 === '2') {
        this.program[this.relativeBase + this.program[pos+3]] = 1
      }else {
        this.program[this.program[ pos + 3]] = 1;
      }
    } else {
      if(p3 === '2') {
        this.program[this.relativeBase + this.program[pos+3]] = 0
      }else {
        this.program[this.program[ pos + 3]] = 0;
      }
    }
    return 4;
  };

  jumpTrue(pos, parsed) {
    const { p1, p2 } = parsed;
    if(this.getVal(this.program,pos+1, p1) !== 0){
      this.n = this.getVal(this.program,pos+2, p2);
      return 0;
    }
    return 3
  };

  jumpFalse(pos, parsed) {
    const { p1, p2 } = parsed;
    if(this.getVal(this.program,pos+1, p1) === 0){
      this.n = this.getVal(this.program,pos+2, p2);
      return 0;
    }
    return 3
  };

  getVal(arr, pos, code){
    if(code === '1'){
      return arr[pos] || 0;
    }
    if(code === '2'){
      return arr[this.relativeBase + arr[pos]] || 0;
    }
    return  arr[arr[pos]] || 0;
  };


  runComp(input){
    this.myOutput = [];
    this.input = input;
    let t = 0;
    while(this.program[this.n] !== 99){
      if(this.program[this.n] == 3 && this.input.length===0) return;
      const parsed = parseOptCode(this.program[this.n]);
      const inc = this.codeDict[parsed.optCode](this.n, parsed);
      this.n += inc;
      t++;
      if (parsed.optCode === '04' && this.myOutput.length === 3) {
        return this.myOutput;
      }
    }
    if(t > 99998){
      console.log('error');
    }
    if(this.program[this.n] === 99) {
      return this.myOutput;
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

exports.IntComputer = IntComputer;
