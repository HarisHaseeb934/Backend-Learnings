const crypto = require("crypto")

const payload = '{"amount": 500, "currency": "USD"}';

const secret = "my_key";

const hmacGen = crypto.createHmac("sha256", secret).update(payload).digest("hex")

console.log(`Payload: ${payload} \nVerfifed Signature: ${hmacGen}`)