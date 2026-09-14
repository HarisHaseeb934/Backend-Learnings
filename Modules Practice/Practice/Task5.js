const path = require("path");
const fs = require("fs");

fs.readFile(path.join("reports", "system_report.json"), "utf-8", (err, data) => {
    if(err){
        console.log(err);
        return;
    }
    console.log("Successfully Read")
    console.log(data)
    const count = data.length;
    fs.appendFile(path.join("reports", "summary.txt"), `Word count: ${count}`, "utf-8", (err) => {
        if(err){
             console.log(err)
             return
        }
        console.log("Successfully Appended")
    })
})