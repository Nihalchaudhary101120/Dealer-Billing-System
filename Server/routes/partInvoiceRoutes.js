import express from "express";
import {
    addPartInvoice,
    getAllPartInvoices,
    getSingleInvoice,
    updatePartInvoice,
    deletePartInvoice,
    printPartInvoice
} from "../controller/partInvoicecontroller.js";

const router = express.Router();

router.post("/", addPartInvoice);

router.get("/", getAllPartInvoices);

router.get("/:id", getSingleInvoice);

router.patch("/:id", updatePartInvoice);

router.delete("/:id", deletePartInvoice);

router.post("/print",printPartInvoice);

export default router;