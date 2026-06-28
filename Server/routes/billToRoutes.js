import express from "express";
import {addBillTo , getAllBillTo,updateBillTo,deleteBillTo} from "../controller/billToController.js";


const router = express.Router();

router.post("/",addBillTo);
router.get("/",getAllBillTo);
router.patch("/:id",updateBillTo);
router.delete("/:id",deleteBillTo);

export default router;