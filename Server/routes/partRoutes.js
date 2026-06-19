import express from 'express';
import{addPart,deletePart,getAllPart,updatePart} from "../controller/partController.js";
const router = express.Router();

router.post("/",addPart);
router.get("/",getAllPart);
router.patch("/:id",updatePart);
router.delete("/:id",deletePart);

export default router;