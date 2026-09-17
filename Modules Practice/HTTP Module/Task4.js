const http = require("http");

const server = http.createServer((req, res) => {
  const { url, method } = req;
  if (url === "/secret" && method === "GET") {
    if (req.headers["authorization"] === "Bearer mysecret123") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Access granted!" }));
    } else {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Access denied" }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log("Running")
})