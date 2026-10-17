import express from "express";
import path from "path";
import { getFromData, getHomePage, redirectToLink, getEditPage, updateLink, deleteLink } from "../controllers/homeControllers.js";

const styleCss = path.join(import.meta.dirname, "..", "public");
console.log(styleCss);

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.static(styleCss));

router.get("/", getHomePage);
router.post("/form", getFromData);
router.get("/:shortCode", redirectToLink);
router.get('/edit/:id', getEditPage)
router.post('/edit/:id', updateLink)
router.post('/delete/:id', deleteLink)

export default router;
