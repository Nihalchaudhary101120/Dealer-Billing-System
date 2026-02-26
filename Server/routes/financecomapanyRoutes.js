import express from "express";
import { addFinanceCompany, deleteFinancecompany, getAllFinanceComapany, updateFinanceCompany } from "../controller/financeCompanyController.js";
const router = express.Router();

router.post("/", addFinanceCompany);
router.get("/", getAllFinanceComapany);
router.patch("/:id", updateFinanceCompany);
router.delete("/:id", deleteFinancecompany);

export default router;