import fs from "fs/promises";
import path from "path";
import http from "http";
import crypto from "crypto";
import { link } from "fs";

const DATA_FILE = path.join("data", "links.json");

async function serveFile(res, filePath, fileType) {
  try {
    const file = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": fileType });
    res.end(file);
  } catch (error) {
    if (error.code === "ENOENT") {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Requestd File Not Found");
    } else {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Disk Failure");
    }
  }
}

async function loadFile() {
  try {
    const file = await fs.readFile(path.join(DATA_FILE));
    return JSON.parse(file) || {};
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(DATA_FILE, JSON.stringify({}));
      return {};
    }
    throw error;
  }
}

async function saveToFile(links) {
  await fs.writeFile(DATA_FILE, JSON.stringify(links));
}

const server = http.createServer(async (req, res) => {
  let { url, method } = req;
  if (url === "/" && method === "GET") {
    return serveFile(res, path.join("public", "index.html"), "text/html");
  } else if (url === "/style.css" && method === "GET") {
    return serveFile(res, path.join("public", "style.css"), "text/css");
  } else if (url === "/links" && method === "GET") {
    const links = await loadFile();
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(links));
  } else if (url === "/shorten" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const { url, short } = JSON.parse(body);
        if (!url) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          return res.end("URL is required");
        }
        const links = await loadFile();
        const shortCode = short || crypto.randomBytes(4).toString("hex");
        if (links[shortCode]) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          return res.end("Pls Enter New Custom URL, Its is Already exists");
        }
        links[shortCode] = url;
        await saveToFile(links);
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ success: true }));
      } catch (error) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Route not found");
      }
    });
  } else {
    const links = await loadFile();
    let short = req.url.slice(1);
    if (links[short]) {
      res.writeHead(302, { location: links[short] });
      res.end();
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  }
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server Running on PORT:${PORT}`);
});
