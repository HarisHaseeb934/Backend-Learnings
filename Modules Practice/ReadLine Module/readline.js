const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


rl.on("line", (ans) => {
    if(ans === "quit"){
        rl.close()
    }else{
        console.log(ans)
    }
})

rl.question("Enter Your Name: ", (ans) => {
    rl.emit("line", ans)
    // rl.close()
})

