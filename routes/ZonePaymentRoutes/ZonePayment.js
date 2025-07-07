import express from "express";
const router = express.Router();
import zonePaymentController from "../../controller/zonePaymentController.js";

router.post("/initiate", zonePaymentController.initiateZonePayment);
router.post("/confirm", zonePaymentController.confirmZonePayment);
router.get("/", zonePaymentController.getAllPayments);
router.get("/:id", zonePaymentController.getPaymentByTransactionId);
router.put("/:id/:paymentStatus", zonePaymentController.editPaymentStatus);

export default router;

