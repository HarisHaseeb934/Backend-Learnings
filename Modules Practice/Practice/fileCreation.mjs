import fs from "fs";
import path from "path";
import readline from "readline/promises";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
async function fileCreate() {
  try {
    const name = await rl.question("Enter File Name: ");
    const fileName = `${name.trim()}.txt`;
    if (fs.existsSync(path.join(fileName))) {
      console.log("File Already Exists");
    } else {
      console.log("File Created SuccessFully\m");
      const text = await rl.question("Enter File Content: ");
      await fs.promises.writeFile(
        path.join(fileName),
        text,
        "utf-8",
      );
    }
  } catch (error) {
    console.log(error.message);
  } finally {
    rl.close();
  }
}

fileCreate();
