const {Logger} = require("./Logger.js");

const logger = new Logger();

logger.on("messageLogged", ({timeStamp, message}) => {
    console.log(`User logged in on ${timeStamp} \nMessage: ${message}`)
})

logger.log("Hello my Name is Haris")