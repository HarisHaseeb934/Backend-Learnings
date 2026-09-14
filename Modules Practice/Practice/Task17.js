const fs = require("fs");
const path = require("path");
const os = require("os");
const zlib = require("zlib");
const EventEmitter = require("events");

const emitter = new EventEmitter();

const gzip = zlib.createGzip();

const writable = fs.createWriteStream("audit.log", { flags: "a" });
const readable = fs.createReadStream("audit.log");
const destination = fs.createWriteStream(path.join("audit.log.gz"));

function writeData(data) {
  writable.write(data);
}

function stat() {
  // console.log(os.uptime() / 60)
  return {
    platform: os.platform(),
    upTime: Math.floor(os.uptime() / 60),
    platform: os.platform(),
    totalmem: os.totalmem(),
    freemem: os.freemem(),
  };
}

let count = 0;

const timer = setInterval(() => {
  count++;
  let data = JSON.stringify(stat()) + "\n"
  writeData(data)
  if(count === 3){
    writable.end()
    if(!fs.existsSync(destination))
    readable.pipe(gzip).pipe(destination)
    emitter.emit("auditComplete")
    clearInterval(timer)
  }
}, 500);


emitter.on("auditComplete", () => {
    console.log("System audit archived successfully.");
})