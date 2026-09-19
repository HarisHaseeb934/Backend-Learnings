const os = require("os");

console.log(`Platform ${os.platform()}`);
console.log(`Architecture ${os.arch()}`);
console.log(`OS Type ${os.type()}`);
console.log(`OS Release ${os.release()}`);

console.log(os.cpus())

console.log(`Total Memory ${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB`);
console.log(`Free Memory ${(os.freemem() / (1024 ** 3)).toFixed(2)}`)
console.log(`Used Memory Percentage ${(((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(2)}`)

console.log(os.networkInterfaces())

console.log(os.userInfo())

console.log(`Temp Dir ${os.tmpdir()}`)
console.log(`Home Dir ${os.homedir()}`)

console.log(((os.uptime() / 60) / 60).toFixed(2))
