import { getShortCode, loadLinks, saveLinks } from "../models/links.js";
import crypto from "crypto";

export const getHomePage = async (req, res) => {
  try {
    const links = await loadLinks();
    console.log(links)
    res.render("index", { links, host: req.host });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const getFormData = async (req, res) => {
  const { url, shortCode } = req.body;
  try {
    // const links = await loadLinks();
    const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");

    await saveLinks({ finalShortCode, url });

    res.redirect("/");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const getLink = async (req, res) => {
  const { shortCode } = req.params;
  console.log("Shoert", shortCode)
  try {
    const links = await getShortCode(shortCode);
    console.log(links)
    if(!links){
        return res.status(404).send("Not Found")
    }

    return res.redirect(links.at(0).url);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
