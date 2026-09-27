import express, { Router } from "express";
import {
  getFromData,
  getLinks,
  getPage,
} from "../controllers/homeControllers.js";
import path from "path";

const staticFiles = path.join(import.meta.dirname, "..", "public");

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.static(staticFiles));

router.get("/", getPage);

router.post("/", getFromData);

router.get("/:shortCode", getLinks);

export default router;
