import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Zone from "../models/Zone.js";
import PaymentTransaction from "../models/PaymentTransaction.model.js";
import { Types } from "mongoose";
import mongoose from "mongoose";
import { point as turfPoint, booleanPointInPolygon } from "@turf/turf";

dotenv.config();

const PaymentStatusFilterController = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status query parameter is required"
      });
    }

    const validStatuses = ["Pending", "Paid", "Failed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status value. Valid values are: Pending, Paid, Failed"
      });
    }

    const query = { paymentStatus: status };
    const total = await PaymentTransaction.countDocuments(query);

    const paymentTransactions = await PaymentTransaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
      count: paymentTransactions.length,
      data: paymentTransactions
    });
  } catch (error) {
    console.error("Error in PaymentStatusFilterController:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};


const PaymentServicePlancontroller = async (req, res) => {
    try {
        
        const {zoneId,planId }= req.query;
        
        if (!planId) {
            return res.status(400).json({ success: false, error: "Plan ID query parameter is required" });
        }

        const paymentTransactions = await PaymentTransaction.find({
            planId:new mongoose.Types.ObjectId(planId),
            zoneId: new mongoose.Types.ObjectId(zoneId) 
        },)

        

        return res.status(200).json({ success: true, data: paymentTransactions });

        



    } catch (error) {
        console.error("Error in PaymentServicePlancontroller:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

 const getFilteredPaymentData = async (req, res) => {
  const { method, page = 1, limit = 10 } = req.query;

  const filter = {};

  if (method) {
    filter.method = method.toLowerCase(); // assuming stored as "upi", "card", "wallet"
  }

  try {
    const total = await PaymentTransaction.countDocuments(filter);

    const transactions = await PaymentTransaction.find(filter)
      .sort({ createdAt: -1 }) // optional: latest first
      .skip((page - 1) * limit)
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
    console.error("Error filtering payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFilterdPymentByStatusAndMethod = async (req, res) => {
  try {

    const { status, method, page = 1, limit = 10 } = req.query;

    if (!status || !method) {
      return res.status(400).json({
        success: false,
        error: "Both status and method query parameters are required"
      });
    }

    const validStatuses = ["Pending", "Paid", "Failed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status value. Valid values are: Pending, Paid, Failed"
      });
    }

    const validMethods = ["upi", "card","card","netbanking","upi","wallet",];
    if (!validMethods.includes(method.toLowerCase())) { 
      return res.status(400).json({
        success: false,
        error: "Invalid method value. Valid values are: upi, card, wallet"
      });
    }
  
    const query = {
      paymentStatus: status,
      method: method.toLowerCase() // assuming stored as "upi", "card", "wallet"
    };

    const total = await PaymentTransaction.countDocuments(query);

    const paymentTransactions = await PaymentTransaction.find(query)
      .sort({ createdAt: -1 }) // optional: sort latest first
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
      count: paymentTransactions.length,
      data: paymentTransactions
    });

    
  } catch (error) {
    console.error("Error in getFilterdPymentByStatusAndMethod:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
    
  }
}






export default {PaymentStatusFilterController, PaymentServicePlancontroller,getFilteredPaymentData,getFilterdPymentByStatusAndMethod};
