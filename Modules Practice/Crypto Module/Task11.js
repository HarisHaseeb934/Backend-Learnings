const crypto = require("crypto")

function createSession(userId){
    const sessionId = crypto.randomUUID();
    const sessionToken = crypto.randomBytes(32);
    const createdAt = new Date().toISOString();

    return{
        sessionId, sessionToken, createdAt
    }
}

console.log(createSession("Haris"))