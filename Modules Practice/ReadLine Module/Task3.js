const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let count = 0;

rl.on("line", (line) => {
    count++;
    if(line.trim() === "exit"){
        rl.close()
    }else{
        console.log(`${count}. ${line}`)
    }
})

rl.on("close", () => {
    console.log("Googbye")
})