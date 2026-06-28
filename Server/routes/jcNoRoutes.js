import express from "express";
import {addJcNo , deleteJcNo , getAllJcNo,updateJcNo,updateCounter} from "../controller/jcNoController.js";


const router = express.Router();
router.post("/",addJcNo);
router.get("/",getAllJcNo);
router.patch("/counter/:id",updateCounter);
router.patch("/:id",updateJcNo);
router.delete("/:id",deleteJcNo);


export default router;