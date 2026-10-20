import crypto from "crypto";
import z from "zod";
import { UrlShortener } from "../models/URLShortener.js";
import { deleteLinkFromUser } from "../services/authServices.js";

export const getHomePage = async (req, res) => {
  if (!req.user) return res.redirect("/login");
  const links = await UrlShortener.find({ user: req.user.id });
  res.render("index", { links, host: req.host });
};

export const getFromData = async (req, res) => {
  const { shortCode, url } = req.body;
  const finalShortCode = shortCode
    ? shortCode
    : crypto.randomBytes(4).toString("hex");
  const exists = !!(await UrlShortener.exists({ shortCode: finalShortCode }));
  if (exists) {
    return res
      .status(400)
      .json({ success: false, message: "Short Code Already Exists" });
  }
  await UrlShortener.create({
    shortCode: finalShortCode,
    url,
    user: req.user.id,
  });
  return res.status(301).redirect("/");
};

export const redirectToLink = async (req, res) => {
  const { shortCode } = req.params;
  const link = await UrlShortener.findOne({ shortCode: shortCode });
  res.redirect(link.url);
};

export const getEditPage = async (req, res) => {
  const result = z.coerce.string().safeParse(req.params.id);
  if (!result.success) {
    throw new Error("Not Valid Id", 404);
  }
  const link = await await UrlShortener.findById(result.data);
  res.render("edit", { link, error: req.flash("error") });
};

export const updateLink = async (req, res) => {
  const result = z.coerce.string().safeParse(req.params.id);
  if (!result.success) {
    throw new Error("Not Valid Id", 404);
  }
  const { url, shortCode } = req.body;
  const link = await UrlShortener.updateOne(
    { _id: result.data },
    { $set: { url, shortCode } },
  );
  res.redirect("/");
};

export const deleteLink = async (req, res) => {
  const id = req.params.id;
  await deleteLinkFromUser(id);
  res.redirect("/");
};
