import express from "express";
const router = express.Router();
import zonePaymentController from "../../controller/zonePaymentController.js";
import PaymentFilterController from "../../controller/PaymentFilterController.js";

router.post("/initiate", zonePaymentController.initiateZonePayment);
router.post("/confirm", zonePaymentController.confirmZonePayment);
router.get("/", zonePaymentController.getAllPayments);
router.get("/:id", zonePaymentController.getPaymentByTransactionId);
router.put("/:id/:paymentStatus", zonePaymentController.editPaymentStatus);

router.get("/filter/status", PaymentFilterController.PaymentStatusFilterController);
router.get("/filter/plan", PaymentFilterController.PaymentServicePlancontroller);
router.get("/filter/method", PaymentFilterController.getFilteredPaymentData);


export default router;

