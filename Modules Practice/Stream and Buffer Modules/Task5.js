const os = require("os");
const path = require("path");
const fs = require("fs");
const zlib = require("zlib");

function systemStat() {
  return {
    systemPlatform: os.platform(),
    systemTotalmem: os.totalmem(),
    systemFreemem: os.freemem(),
    memUsagePercent: (
      ((os.totalmem() - os.freemem()) / os.totalmem()) *
      100
    ).toFixed(2),
  };
}

const writable = fs.createWriteStream(path.join("logs", "system.log"), {
  flags: "a",
});

let count = 0;

let timer = setInterval(() => {
  const str = JSON.stringify(systemStat());
  const buff = Buffer.from(str);
  writable.write(buff);
  count++;
  if (count === 5) {
    clearInterval(timer);
    writable.end(() => {
      let readable = fs.createReadStream(path.join("logs", "system.log"));
      const gzip = zlib.createGzip();
      let writeableFile = fs.createWriteStream(
        path.join("logs", "system.log.gz"),
      );
      readable
        .pipe(gzip)
        .pipe(writeableFile)
        .on("finish", () => console.log("Backup compression completed"));
    });
  }
}, 1000);
