import express from 'express';
import {addInvoice, deleteInvoice , getAllDraft, getAllInvoice , updateInvoice} from "../controller/invoiceContoller.js";
const router = express.Router();

router.post("/",addInvoice);
router.get("/", getAllInvoice);
router.get("/draft", getAllDraft);
router.patch("/:id" , updateInvoice);
router.delete("/:id", deleteInvoice);

export default router;