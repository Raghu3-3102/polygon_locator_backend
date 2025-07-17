import serviceChargeThresold from "../../controller/ServiceChargeThresold.js"; // Adjust the path as necessary
import express from "express";
const router = express.Router();

router.post("/set-service-threshold", serviceChargeThresold.setServiceThrisold);
router.put("/edit-service-threshold/:id", serviceChargeThresold.editServiceThreshold);
router.get("/get-all-slabs", serviceChargeThresold.getAllSlabs);
router.get("/get-slab/:id", serviceChargeThresold.getSlabById);
router.delete("/delete-slab/:id", serviceChargeThresold.deleteSlab);

export default router;