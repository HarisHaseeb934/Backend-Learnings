const { emit } = require("cluster");
const EventEmitter = require("events");
const path = require("path");
const fs = require("fs");

const emitter = new EventEmitter();

let summary = {
  login: 0,
  logout: 0,
  purchase: 0,
  profileUpdate: 0,
};

// const summaryData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

async function fsReadWrite() {
  let filePath = path.join("reports", "summary2.json");
  let data;
  try {
    if (fs.existsSync(filePath)) {
        console.log("hello")
      data = await fs.promises.readFile(filePath, "utf-8");
      summary = JSON.parse(data);
    } else {
      await fs.promises.writeFile(filePath, JSON.stringify(summary), "utf-8");
    }

    emitter.on("login", (name) => {
      summary["login"]++;
      console.log(`${name} is loggedIn`);
    });
    emitter.on("logout", (name) => {
      summary["logout"]++;
      console.log(`${name} is loggedOut`);
    });
    emitter.on("purchase", (item) => {
      summary["purchase"]++;
      console.log(`${item} is purchased successfully`);
    });
    emitter.on("profileUpdate", (name, updateName) => {
      summary["profileUpdate"]++;
      console.log(`${name} is update to this ${updateName}`);
    });

    emitter.on("summary", () => {
      console.log(summary);
    });

    emitter.emit("login", "Haris");
    emitter.emit("logout", "Haris");
    emitter.emit("purchase", "PC");
    emitter.emit("profileUpdate", "Haris", "Soban");

    emitter.emit("summary");

    await fs.promises.writeFile(filePath, JSON.stringify(summary), "utf-8");
  } catch (error) {
    console.log(error);
  }
}

fsReadWrite();
