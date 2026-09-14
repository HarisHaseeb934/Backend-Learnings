const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("userRegistered", ({email}) => {
    console.log(`Email sent to ${email}`)
})
emitter.on("userRegistered", ({username}) => {
    console.log(`Database entry created for ${username}`)
})
emitter.on("userRegistered", ({username}) => {
    console.log(`Analytics logged for ${username}`)
})

emitter.once("appInit", () => {
    console.log("App Initialized");
})

emitter.emit("appInit");
emitter.emit("userRegistered", {email: "harishaseeb@getMaxListeners.com", username: "Haris"})
emitter.emit("appInit");