import express from 'express';
import{addHsn,deleteHsn,getAllHsn,updateHsn} from "../controller/hsnController.js";

const router = express.Router();

router.post("/",addHsn);
router.get("/",getAllHsn);
router.patch("/:id",updateHsn);
router.delete("/:id",deleteHsn);

export default router;