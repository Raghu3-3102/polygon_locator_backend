import express from "express";
const router = express.Router();
import zonePaymentController from "../../controller/zonePaymentController.js";

router.post("/initiate", zonePaymentController.initiateZonePayment);
router.post("/confirm", zonePaymentController.confirmZonePayment);

export default router;

