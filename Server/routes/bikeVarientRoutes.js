import express from "express";
import { addVarient, deleteVarient, getAllVarient, updateVarient } from "../controller/bikeVersionController.js";

const router = express.Router();

router.post("/", addVarient);
router.get("/", getAllVarient);
router.patch("/:id", updateVarient);
router.delete("/:id", deleteVarient);

export default router;