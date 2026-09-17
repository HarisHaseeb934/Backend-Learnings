const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const Task = [];

function show() {
  console.log("Enter 1 to Add Task");
  console.log("Enter 2 to View Tasks");
  console.log("Enter 3 to Quit");

  rl.question("Choose Options :", (ans) => {
    if (ans.trim() === "1") {
      rl.question("Enter Task:", (task) => {
        Task.push(task);
        console.log(task);
        show();
      });
    } else if (ans.trim() === "2") {
      Task.forEach((task) => {
        console.log(task);
      });
      show();
    } else if (ans.trim() === "3") {
      console.log("GoodBye");
      rl.close();
    } else {
      console.log("Choose Valid Options");
      show();
    }
  });
}

show()