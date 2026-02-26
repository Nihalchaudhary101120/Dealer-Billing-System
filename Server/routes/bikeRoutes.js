import express from "express";
import { addBike, deleteBike, getAllBike, updateBike } from "../controller/bikeController.js";
const router = express.Router();

router.post("/", addBike);
router.get("/", getAllBike);
router.patch("/:id", updateBike);
router.delete("/:id", deleteBike);

export default router;