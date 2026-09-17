const http = require("http");

const server = http.createServer((req, res) => {
  const { url, method } = req;

  if (url === "/api/message") {
    if (method === "GET") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("This is a GET request");
    } else if (method === "POST") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("This is a POST request");
    } else {
      res.writeHead(405, { "Content-Type": "text/plain" });
      res.end("Method not supported");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log("Running");
});
