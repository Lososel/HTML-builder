const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Welcome! Please enter text. Type "exit" or press Ctrl+C to quit.');

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    rl.close();
  } else {
    writeStream.write(input + '\n');
    console.log('Text saved. Enter more text or type "exit" to quit.');
  }
});

rl.on('close', () => {
  console.log('Goodbye! Have a great day!');
  writeStream.end();
  process.exit(0);
});