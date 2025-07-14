import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Zone from "../models/Zone.js";
import PaymentTransaction from "../models/PaymentTransaction.model.js";
import { point as turfPoint, booleanPointInPolygon } from "@turf/turf";
import { sendEmail,sendFailedPaymentEmail } from "../Utility/sendMail.js";
import {sucessfullPayment,FailedPayment} from '../mailText/invoiceMailText.js'
import {paymenInvoiceText,paymenInvoiceFailedText} from '../Utility/PymentInvoiceText.js'
import {generatePDF} from "../Utility/genratePdf.js";
import axios from "axios";

dotenv.config();



export const initiateZonePayment = async (req, res) => {
  try {
    const {
      name, email, phoneNumber, dob,
      serviceNeeded, address, amount,
      city, state, nation, zipCode,
      planDetails // Directly passed from frontend
    } = req.body;

    // Validate required fields
    if (!name || !email || !phoneNumber || !dob || !serviceNeeded || !address ||
        !amount || !city || !state || !nation || !zipCode || !planDetails) {
      return res.status(400).json({
        success: false,
        error: "All fields are required"
      });
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        error: "Phone number is invalid"
      });
    }

    // Create Razorpay order
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `zone_order_${Date.now()}`
    });

    // Save transaction directly
    const transaction = await PaymentTransaction.create({
      name,
      email,
      phoneNumber,
      dob,
      serviceNeeded,
      address,
      city,
      state,
      nation,
      zipCode,
      amount,
      razorpayOrderId: razorpayOrder.id,
      currency: "INR",
      paymentStatus: "Pending",
      status: "created",
      created_at: Math.floor(Date.now() / 1000),
      flow: "web",
      planDetails
    });

    res.json({
      success: true,
      amount,
      razorpayOrderId: razorpayOrder.id,
      transactionId: transaction._id
    });

  } catch (err) {
    console.error("🔥 Payment initiation error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to initiate payment",
      message: err.message
    });
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

      const failedPaymentText = FailedPayment(transaction.name, transaction.amount, transaction.razorpayOrderId);
      const pdfText = paymenInvoiceFailedText(transaction);
      const pdfBuffer = await generatePDF(pdfText);
      console.log("PDF generated successfully",pdfBuffer);

      await sendFailedPaymentEmail(transaction.email, failedPaymentText, process.env.MAIL_USER, process.env.MAIL_PASS, pdfBuffer);


     
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

    const planName = transaction.planDetails?.planName || "N/A"; // Extract plan name from planDetails
     console.log("Transaction updated:", planName);
// Build external API payload
    const externalPayload = {
    Request: {
    requestDate: new Date().toISOString(),
    extTransactionId: transactionId,
    systemId: "priyads",
    password: "Priya@2025",
    UAN: "ggw0VGWp",
    UserType: "Staff"
  },
     Funnel: {
    Name: transaction.name,
    Address: transaction.address,
    ServiceType: 'Broadband',
    City: transaction.city,
    State: transaction.state,
    Nation: transaction.nation,
    ZipCode: transaction.zipCode,
    MobileNo: transaction.phoneNumber,
    EMail: transaction.email,
    Plan: planName || "N/A", // or extract from planId if needed
    ReferralUserId: "",
    ReferralEmployeeName: "",
    ReferralEmployeeID: "",
    ReferralMobile: "",
    Source: "",
    ReferralCompanyId: "",
    NotificationReceive: "True"
  }
};


// Send the POST request
try {
  const response = await axios.post(
    "https://liveon.nedataa.com/api/extservice.asmx/CreateFunnel",
    externalPayload,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  console.log("✅ External API response:", response.data);
} catch (error) {
  console.error("❌ Error calling external API:", error.message);
}


    try {

    const sendEmailtexts = sucessfullPayment(transaction.amount,transaction.name)
    const pdfText = paymenInvoiceText(transaction)

    const pdfBuffer = await generatePDF(pdfText);
    console.log("PDF generated successfully",pdfBuffer);
    // Send the PDF as an attachment

    await sendEmail(transaction.email,sendEmailtexts ,process.env.MAIL_USER, process.env.MAIL_PASS ,pdfBuffer);
    console.log("Email sent successfully");
      
    } catch (error) {
    console.error("❌ Error sending email:", error.message);
    // Handle email sending error, but don't block the payment confirmation
    }

   
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
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const total = await PaymentTransaction.countDocuments();
    const transactions = await PaymentTransaction.find()
      .sort({ createdAt: -1 }) // optional: sort latest first
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
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

    const transaction = await PaymentTransaction.findById(id);

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

