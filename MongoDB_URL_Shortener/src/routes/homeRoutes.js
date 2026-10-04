import express, { Router } from "express";
import path from "path";
import { getFormData, getHomePage, getLink } from "../controllers/homeControllers.js";

const styleCss = path.join(import.meta.dirname, "..","..", "public");
console.log(styleCss)

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.static(styleCss));

router.get("/", getHomePage);
router.post("/form", getFormData);
router.get("/:shortCode", getLink)

export default router