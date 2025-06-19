import express from "express";
const router = express.Router();
import zoneController from "../../controller/zoneController.js";
import upload from "../../middleware/multer.js"

router.post("/match-location", zoneController.checkLocation);
router.post("/upload", upload.single("kml"), zoneController.importKML);

export default router;
