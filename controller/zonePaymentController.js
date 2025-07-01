import Razorpay from "razorpay";
import crypto from "crypto";
import Zone from "../models/Zone.js";
import PaymentTransaction from "../models/PaymentTransaction.model.js";
import { point as turfPoint, booleanPointInPolygon } from "@turf/turf";

// import Razorpay from "razorpay";
// import { point as turfPoint } from "@turf/helpers";
// import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
// import Zone from "../models/Zone.model.js"; // adjust the path as per your project
// import PaymentTransaction from "../models/PaymentTransaction.model.js"; // adjust path too
import dotenv from "dotenv";
dotenv.config();


export const initiateZonePayment = async (req, res) => {
  try {
    const {
      lat,
      lng,
      name,
      email,
      phoneNumber,
      dob,
      serviceNeeded,
      address
    } = req.body;

    const userPoint = turfPoint([lng, lat]);
    console.log("📍 User Point:", userPoint);

    const zones = await Zone.find();
    console.log("📦 Available Zones:", zones.length);

    let matchedZone = null;

    for (const zone of zones) {
      const polygonFeature = {
        type: "Feature",
        geometry: zone.geometry,
      };

      if (booleanPointInPolygon(userPoint, polygonFeature)) {
        matchedZone = zone;
        break;
      }
    }

    if (!matchedZone) {
      return res.status(400).json({ error: "No active zone for this location" });
    }

    const basePrice = matchedZone.properties[0]?.price || 0;
    console.log("💰 Base Price:", basePrice);

    const vendorKey = process.env.RAZORPAY_KEY_ID;
    const vendorSecret = process.env.RAZORPAY_SECRET;

    if (!vendorKey || !vendorSecret) {
      console.error("❌ Razorpay credentials missing in .env");
      return res.status(500).json({ error: "Payment service configuration error" });
    }

    const razorpay = new Razorpay({
      key_id: vendorKey,
      key_secret: vendorSecret
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: basePrice * 100, // amount in paise
      currency: "INR",
      receipt: `zone_order_${Date.now()}`
    });

    console.log("🆔 Razorpay Order Created:", razorpayOrder.id);

    const transaction = await PaymentTransaction.create({
      name,
      email,
      phoneNumber,
      dob,
      serviceNeeded,
      address,
      zoneId: matchedZone._id,
      amount: basePrice,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "Pending"
    });

    console.log("💾 Transaction saved:", transaction._id);

    res.json({
      success: true,
      zone: matchedZone.zone,
      amount: basePrice,
      razorpayOrderId: razorpayOrder.id,
      transactionId: transaction._id
    });

  } catch (err) {
    console.error("🔥 Zone payment initiation error:", err);
    res.status(500).json({ error: "Failed to initiate payment", message: err?.message });
  }
};






const confirmZonePayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      transactionId
    } = req.body;

    // Validate transaction ID
    const transaction = await PaymentTransaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Validate signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      transaction.paymentStatus = "Failed";
      await transaction.save();

      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay signature",
        transactionId
      });
    }

    // Payment verified, update transaction
    transaction.razorpayPaymentId = razorpayPaymentId;
    transaction.razorpaySignature = razorpaySignature;
    transaction.paymentStatus = "Paid";
    await transaction.save();

    res.status(200).json({
      success: true,
      message: "Payment verified and recorded successfully",
      transaction
    });

  } catch (err) {
    console.error("❌ Payment confirmation error:", err.message);
    res.status(500).json({ error: "Payment confirmation failed" });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const transactions = await PaymentTransaction.find().populate("zoneId");
    
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error("❌ Error fetching payments:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment transactions"
    });
  }
};

 const getPaymentByTransactionId = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await PaymentTransaction.findById(id).populate("zoneId");

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });

  } catch (error) {
    console.error("❌ Error fetching transaction:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transaction"
    });
  }
};
export default {initiateZonePayment,confirmZonePayment,getAllPayments,getPaymentByTransactionId}
