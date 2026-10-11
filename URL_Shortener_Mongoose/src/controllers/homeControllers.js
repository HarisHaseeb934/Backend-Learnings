import { UrlShortener } from "../models/UrlShortener.js";
import crypto from "crypto";

export const getHomePage = async (req, res) => {
  const links = await UrlShortener.find().select("url shortCode -_id");
  console.log(links);
  res.render("index", { links, host: req.host });
};

export const getFromData = async (req, res) => {
  const { shortCode, url } = req.body;
  const finalShortCode = shortCode
    ? shortCode
    : crypto.randomBytes(4).toString("hex");
  const exists = !!(await UrlShortener.exists({ shortCode: finalShortCode }));
  if (exists) {
    res
      .status(400)
      .json({ success: false, message: "Short Code Already Exists" });
  }
  await UrlShortener.create({ shortCode: finalShortCode, url });
  res.status(301).redirect("/");
};

export const redirectToLink = async (req, res) => {
  const { shortCode } = req.params;
  const link = await UrlShortener.findOne({ shortCode: shortCode });
  res.redirect(link.url);
};
