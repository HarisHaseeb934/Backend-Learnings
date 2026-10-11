import express from "express";
import path from "path";
import { getFromData, getHomePage, redirectToLink } from "../controllers/homeControllers.js";

const styleCss = path.join(import.meta.dirname, "..", "public");
console.log(styleCss);

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.static(styleCss));

router.get("/", getHomePage);
router.post("/form", getFromData);
router.get("/:shortCode", redirectToLink);

export default router;
