import express from "express";
import { addColor, deleteColor, getAllColor, updateColor } from "../controller/bikeColorController.js";

const router = express.Router();

router.post("/", addColor);
router.get("/", getAllColor);
router.patch("/:id", updateColor);
router.delete("/:id", deleteColor);

export default router;