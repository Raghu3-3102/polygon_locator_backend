import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Zone from "../models/Zone.js";
import PaymentTransaction from "../models/PaymentTransaction.model.js";
import { point as turfPoint, booleanPointInPolygon } from "@turf/turf";

dotenv.config();

export const initiateZonePayment = async (req, res) => {
  try {
    const {
       name, email, phoneNumber, dob,
      serviceNeeded, address, amount,zoneId,
      planId // contains full plan info
    } = req.body;

    if (!name || !email || !phoneNumber || !dob || !serviceNeeded || !address || !amount || !zoneId || !planId) {
      return res.status(400).json({
        success: false,
        error: "All fields are required"
      })
    }

    // Validate the zoneId
    const matchedZone = await Zone.findById(zoneId);
    if (!matchedZone) {
      return res.status(404).json({
        success: false,
        error: "Zone not found"
      });

    }

   // 2️⃣ Validate planId inside zone.properties
    const matchedPlan = matchedZone.properties.find(plan =>
      plan._id.toString() === planId 
    );

    if (!matchedPlan) {
      return res.status(404).json({
        success: false,
        error: "Plan not found in the specified zone"
      });
    }
    console.log("Matched Plan:", matchedPlan);


    const basePrice = amount;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: basePrice * 100,
      currency: "INR",
      receipt: `zone_order_${Date.now()}`
    });

    const transaction = await PaymentTransaction.create({
      name,
      email,
      phoneNumber,
      dob,
      serviceNeeded,
      address,
      zoneId: matchedZone._id,
      planId:matchedPlan._id, // Store the plan ID
      amount: basePrice,
      razorpayOrderId: razorpayOrder.id,
      currency: "INR",
      paymentStatus: "Pending",
      status: "created",
      created_at: Math.floor(Date.now() / 1000),
      flow: "web"
    });

    res.json({
      success: true,
      zone: matchedZone.zone,
      amount: basePrice,
      razorpayOrderId: razorpayOrder.id,
      transactionId: transaction._id
    });

  } catch (err) {
    console.error("🔥 Payment initiation error:", err);
    res.status(500).json({ 
      success: false,
      error: "Failed to initiate payment",
      message: err.message });
  }
};

export const confirmZonePayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      transactionId
    } = req.body;

    const transaction = await PaymentTransaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      transaction.paymentStatus = "Failed";
      await transaction.save();
      return res.status(400).json({ 
        success: false,
        error: "Invalid Razorpay signature" 
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET
    });

    const paymentDetails = await razorpay.payments.fetch(razorpayPaymentId);

    Object.assign(transaction, {
      razorpayPaymentId,
      razorpaySignature,
      paymentStatus: "Paid",

      razorpayId: paymentDetails.id, // safer than using 'id'
      status: paymentDetails.status,
      method: paymentDetails.method,
      amount_refunded: paymentDetails.amount_refunded,
      amount_transferred: paymentDetails.amount_transferred,
      refund_status: paymentDetails.refund_status,
      captured: paymentDetails.captured,
      description: paymentDetails.description,
      card_id: paymentDetails.card_id,
      card: paymentDetails.card,
      bank: paymentDetails.bank,
      wallet: paymentDetails.wallet,
      vpa: paymentDetails.vpa,
      contact: paymentDetails.contact,
      notes: paymentDetails.notes,
      fee: paymentDetails.fee,
      tax: paymentDetails.tax,
      error_code: paymentDetails.error_code,
      error_description: paymentDetails.error_description,
      created_at: paymentDetails.created_at,
      card_type: paymentDetails.card?.type || null,
      card_network: paymentDetails.card?.network || null,
      Auth_code: paymentDetails.acquirer_data?.auth_code || null,
      Payments_ARN: paymentDetails.acquirer_data?.arn || null,
      Payments_RRN: paymentDetails.acquirer_data?.rrn || null,
      flow: paymentDetails.flow
    });

    await transaction.save();

    res.json({
      success: true,
      message: "Payment confirmed",
      transaction
    });

  } catch (err) {
    console.error("❌ Confirm payment error:", err.message);
    res.status(500).json({ 
      success: false,
      error: "Payment confirmation failed"
      
     });
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

const editPaymentStatus = async (req,res) =>{

  try {

    const {id,paymentStatus} = req.params;

    const transection = await PaymentTransaction.findById(id);
    if (!transection) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }
    console.log("Editing payment status for transaction:", transection);

    const validStatuses = ["Pending", "Paid", "Failed"];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status"
      });
    }

    transection.paymentStatus = paymentStatus;
    await transection.save();

    res.status(200).json({
      success:true,
      message: "Payment status updated sucessfully",
      data:transection
    })

    

    
  } catch (error) {
    console.error("❌ Error editing payment status:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to edit payment status"
    });
    
  }

}
export default {initiateZonePayment,confirmZonePayment,getAllPayments,getPaymentByTransactionId,editPaymentStatus}

