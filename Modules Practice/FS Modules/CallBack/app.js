const fs = require("fs");
const path = require("path");

fs.writeFile(path.join("Async.txt"), "Async Data through CallBack", "utf-8", (err) => {
    if(err) console.log(err);
    else console.log("Successfully Write")
})

fs.appendFile(path.join("Async.txt"), `\n${new Date()}`, "utf-8", (err) => {
    if(err) console.log(err);
    else console.log("Successfully Write")
})

fs.unlink(path.join("Async.txt"), (err) => {
    if(err) console.log(err);
    else console.log("Successfully Deleted")
})