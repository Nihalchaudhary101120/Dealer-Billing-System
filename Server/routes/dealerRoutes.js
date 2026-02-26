import express from "express";
import {addDealer , getAllDealer , updateDealer,deleteDealer} from "../controller/dealerContoller.js";

const router = express.Router();

router.post("/",addDealer);
router.get("/",getAllDealer);
router.patch("/:id",updateDealer);
router.delete("/:id",deleteDealer);

export default router;