const http = require("http");
const fs = require("fs");
const path = require("path");

const fileDir = __dirname;
const fileName = "index.html";

const indexPath = path.join(fileDir, "public", fileName);

const server = http.createServer(async (req, res) => {
  const url = req.url;
  const method = req.method;

  console.log(method);

  if (url === "/" && method === "GET") {
    try {
      const read = await fs.promises.readFile(indexPath, "utf-8");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(read);
    } catch (error) {
      console.log(error.message);
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

const PORT = 3002;

server.listen(PORT, () => {
  console.log("Server is Running");
});
