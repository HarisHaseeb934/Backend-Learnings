const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const EventEmitter = require("events");

secretKey = "webhook_secret_key_99"

class WebhookEmitter extends EventEmitter{
    constructor(){
        super()
    }

    publishEvent(eventName, payload){
        let jsonData = JSON.stringify(payload);
        let signature = crypto.createHmac("sha256", this.secretKey).update(jsonData).digest("hex");
        let eventId = crypto.randomUUID();

        this.emit("subscribe", { eventId, eventName, payload: jsonData, signature });
    }
}

const wh = new WebhookEmitter();

wh.on("subscribe", ({eventId, eventName, payload, signature}) => {
    let expectedSignature = crypto.createHmac("sha256", secretKey).update(payload).digest("hex");
    if(signature === expectedSignature){
        console.log("Signature Validated:" + true)
    }else{
        console.log("Signature Validated:" + false)
    }
})

wh.publishEvent("hello", {name: "haris"})