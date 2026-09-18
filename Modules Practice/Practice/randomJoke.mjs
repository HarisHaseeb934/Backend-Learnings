import https from "https";


const options = {
    hostname: "official-joke-api.appspot.com",
    path: "/random_joke",
    method: "GET",
    headers: {"User-Agent" : "Node.js Server"}
}

const clientReq = https.request(options, (res) => {
    let body = "";
    res.on("data", (data) => {
        body += data;
    })

    res.on("end", () => {
        let parsed = JSON.parse(body)
        console.log(parsed.setup)
        console.log(parsed.punchline)
    })
})

clientReq.on("error", (error) => {
    console.log(error)
})

clientReq.end()