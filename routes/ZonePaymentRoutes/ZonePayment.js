import express from "express";
const router = express.Router();
import zonePaymentController from "../../controller/zonePaymentController.js";
import PaymentFilterController from "../../controller/PaymentFilterController.js";
import protect from "../../middleware/authMiddleware.js";


router.post("/initiate", zonePaymentController.initiateZonePayment);
router.post("/confirm", zonePaymentController.confirmZonePayment);
router.get("/", zonePaymentController.getAllPayments);
router.get("/:id",protect, zonePaymentController.getPaymentByTransactionId);
router.put("/:id/:paymentStatus",protect, zonePaymentController.editPaymentStatus);

router.get("/filter/status",protect, PaymentFilterController.PaymentStatusFilterController);
router.get("/filter/plan",protect, PaymentFilterController.PaymentServicePlancontroller);
router.get("/filter/method",protect, PaymentFilterController.getFilteredPaymentData);
router.get("/filter/status-and-method",protect, PaymentFilterController.getFilterdPymentByStatusAndMethod);


export default router;

