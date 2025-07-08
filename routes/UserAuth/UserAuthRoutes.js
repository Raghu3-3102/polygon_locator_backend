import userAuth from "../../controller/UserAuth.js";
import express from "express";
const router = express.Router();

router.post("/signup", userAuth.signup);
router.post("/verify-otp", userAuth.verifyOtp);
router.post("/login", userAuth.login);

// Password reset routes
router.post("/forgot-password", userAuth.forgotPassword);
router.post("/verify-forgot-otp", userAuth.verifyForgotOtp);
router.post("/reset-password", userAuth.resetPassword);



export default router;

