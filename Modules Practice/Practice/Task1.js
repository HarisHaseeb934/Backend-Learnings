const { clear } = require("console");
const os = require("os")

function systemInfo(){
    const useMemPercentage = ((((os.totalmem - os.freemem) / 1024 ** 3) / (os.totalmem / 1024 **3)) * 100).toFixed(2);
    console.log(os.platform())
    console.log(os.arch())
    console.log((os.uptime() / 3600))

    return {usedMemory: useMemPercentage, Platform: os.platform(), Arch: os.arch(), Uptime: ((os.uptime()/ 3600)).toFixed(1)}
}
// systemInfo();

module.exports = {systemInfo}