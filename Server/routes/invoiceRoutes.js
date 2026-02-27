import express from 'express';
import {addInvoice, deleteInvoice , getAllInvoice , updateInvoice} from "../controller/invoiceContoller.js";
const router = express.Router();

router.post("/",addInvoice);
router.get("/", getAllInvoice);
router.patch("/:id" , updateInvoice);
router.delete("/:id", deleteInvoice);

export default router;