import express from "express";
import { addModel, getAllModel, updateModel, deleteModel } from "../controller/bikeModelController.js";
const router = express.Router();

router.post("/", addModel);
router.get("/", getAllModel);
router.patch("/:id", updateModel);
router.delete("/:id", deleteModel);

export default router;