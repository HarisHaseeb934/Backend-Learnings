import express from "express";
import path from "path";
import crypto from "crypto";
import fs from "fs/promises";

const PORT = process.env.PORT || 3000;

const app = express();

const dirName = import.meta.dirname;
const JSONFile = path.join(dirName, "JSON", "links.json");

async function loadLinks(filePath) {
  try {
    const file = await fs.readFile(filePath);
    return JSON.parse(file) || {};
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(filePath, JSON.stringify({}));
      return {};
    }
    throw error;
  }
}

async function saveToFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data));
}

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const htmlFile = await fs.readFile(path.join("views", "index.html"));
    const links = await loadLinks(JSONFile);

    const liAdd = htmlFile.toString().replaceAll(
      "{links}",
      Object.entries(links)
        .map(([shortCode, url]) => {
          return `<li><a href = "/${shortCode}" target = "_blank">${req.hostname}/${shortCode}</a></li>`;
        })
        .join(""),
    );

    res.send(liAdd);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/", async (req, res) => {
  try {
    const { shortCode, url } = req.body;
    const links = await loadLinks(JSONFile);
    const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

    if (links[finalShortCode]) {
      res.status(400).send("Short Code Already Exits");
    }

    links[finalShortCode] = url;

    await saveToFile(JSONFile, links);

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/:shortCode", async(req, res) => {
    const {shortCode} = req.params
    try{
        const links = await loadLinks(JSONFile)
        res.redirect(links[shortCode])
    }catch(error){
        console.error(error)
        res.status(500).send("Internal Server Error");
    }
})


app.listen(PORT, () => {
    console.log(`Server is Running on PORT: ${PORT}`)
})