import crypto from "crypto";
import path from "path";
import { loadLinks, saveToFile } from "../models/links.js";

const dirName = import.meta.dirname;
const fileName = path.join(dirName, "..", "JSON", "links.json");

export const getPage = async (req, res) => {
  try {
    const links = await loadLinks(fileName);
    res.render("index", { links, host: req.hostname });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const getFromData = async (req, res) => {
  const { url, shortCode } = req.body;
  try {
    const links = await loadLinks(fileName);
    const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

    if (links[finalShortCode]) {
      return res
        .status(400)
        .send("Short Code Already exits, Please Change ShortCode");
    }

    links[finalShortCode] = url;

    await saveToFile(fileName, links);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const getLinks = async (req, res) => {
  const shortCode = req.params.shortCode;
  try {
    const links = await loadLinks(fileName);
    res.redirect(links[shortCode])
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
