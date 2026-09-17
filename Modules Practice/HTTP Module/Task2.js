const http = require("http");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/api/data" && method === "POST") {
    let body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      try {
        let rawBody = Buffer.concat(body).toString("utf-8");
        let parsed = JSON.parse(rawBody);

        const responseData = {
          id: crypto.randomUUID(),
          ...parsed,
        };

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(responseData));
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON payload" }));
      }

      req.on("error", (err) => {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      });
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log("Server is Running");
});
