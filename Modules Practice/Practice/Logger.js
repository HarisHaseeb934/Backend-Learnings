const { timeStamp } = require("console");
const EventEmitter = require("events");

class Logger extends EventEmitter{
    constructor(){
        super();
    }

    log(message){
        this.emit('messageLogged', {timeStamp: new Date(), message})
    }
}

module.exports = {Logger}