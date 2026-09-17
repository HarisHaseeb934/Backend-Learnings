const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter Your Name : ", (ans) => {
    console.log(`Hello, ${ans}! Welcome to Node.js CLI.`)
    rl.close()
})