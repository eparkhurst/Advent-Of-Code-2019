const { IntComputer } = require('./intComp');
const inquirer = require('inquirer');
const fs = require('fs');

fs.readFile('./data', 'utf8', (err, data) => {
  if (err) throw err;
  const strArr = data.split(',');
  const program = strArr.map(num => Number(num));
  const answer = run(program);
});

const run = async (program) => {
  const comp = new IntComputer(program);

  const getCommand = async (previousInput) => {
    let charCode = [];
    for (let i = 0; i < previousInput.length; i++) {
      charCode.push(previousInput.charCodeAt(i))
    }
    const output = String.fromCharCode(...comp.runComp([...charCode, 10]));
    const prompts = [
      {
        type: 'input',
        name: 'inputValue',
        message: output,
      },
    ];
    const { inputValue } = await inquirer.prompt(prompts);
    return getCommand(inputValue);
  };

  const inputs = await getCommand([]);
};
