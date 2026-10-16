import crypto from "crypto";
import { UrlShortener } from "../models/URLShortener.js";

export const getHomePage = async (req, res) => {
  if(!req.user) return res.redirect("/login")
    console.log("ID: " + req.user._id)
  const links = await UrlShortener.find({user: req.user._id}).select("url shortCode -_id");
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
  console.log("ID: " + req.user._id)
  await UrlShortener.create({ shortCode: finalShortCode, url, user: req.user._id});
  res.status(301).redirect("/");
};

export const redirectToLink = async (req, res) => {
  const { shortCode } = req.params;
  const link = await UrlShortener.findOne({ shortCode: shortCode });
  res.redirect(link.url);
};
