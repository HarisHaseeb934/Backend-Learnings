const http = require("http");

const server = http.createServer((req, res) => {
  const { url } = req;

  if (url === "/echo") {
    let body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      try {
        let rawBody = Buffer.concat(body).toString("utf-8");
        let parsed = JSON.parse(rawBody);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ...parsed, recieved: true }));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON format" }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

const PORT = 3002;

server.listen(PORT, () => {
  console.log("Running");
});
