const readline = require("readline/promises");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function hobby() {
  const hobby = await rl.question("What is your favorite hobby? ");
  const practice = await rl.question(
    "How many hours a week do you practice it? ",
  );

  console.log(`My hobby is ${hobby} and i practice ${practice}`);

  rl.close();
}

hobby() 