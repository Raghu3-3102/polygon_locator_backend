import serviceChargeThresold from "../../controller/ServiceChargeThresold.js"; // Adjust the path as necessary
import express from "express";
const router = express.Router();
import protect from "../../middleware/authMiddleware.js"; // Ensure you have the auth middleware for protected routes

router.post("/set-service-threshold",protect, serviceChargeThresold.setServiceThrisold);
router.put("/edit-service-threshold/:id",protect, serviceChargeThresold.editServiceThreshold);
router.get("/get-all-slabs", serviceChargeThresold.getAllSlabs);
router.get("/get-slab/:id",protect, serviceChargeThresold.getSlabById);
router.delete("/delete-slab/:id",protect, serviceChargeThresold.deleteSlab);

export default router;