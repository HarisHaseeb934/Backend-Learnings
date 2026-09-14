const EventEmitter = require("events");
const fs = require("fs");
const path = require("path");

const fileDir = path.join(__dirname, "logs");
const fileName = path.join(fileDir, "current.logs");

class LogManager extends EventEmitter {
  constructor() {
    super();
    this.ensureStream();
    this.initStream();
  }

  ensureStream() {
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }
  }

  initStream() {
    this.writable = fs.createWriteStream(fileName);
  }

  writeLog(message) {
    const byteSize = Buffer.byteLength(`${message} at ${new Date()}`);
    this.writable.write(`${message} at ${new Date()}`, () => {
      this.emit("logWritten", byteSize);
      const stat = fs.statSync(fileName);
      if (stat.size > 500) {
        this.rotate();
      }
    });
  }

  rotate() {
    this.writable.end(() => {
      const archived = path.join(fileDir, "archieve.log");
      fs.renameSync(archived, archived);
      this.emit("archieved", archived);
      this.initStream();
    });
  }
}

const log = new LogManager();

log.on("logWritten", (byteSize) => {
  console.log(byteSize);
});
log.on("archived", (filePathUpdated) => {
  console.log(filePathUpdated);
});
log.writeLog("Haris");
log.writeLog("jjajaja");
