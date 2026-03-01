import express from "express";

import {addScheme, deleteScheme, getAllScheme,updateScheme} from "../controller/bikeSchemeController.js";

const router = express.Router();

router.post("/",addScheme);
router.get("/",getAllScheme);
router.patch("/:id",updateScheme);
router.delete("/:id",deleteScheme);

export default router;