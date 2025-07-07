import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Zone from "../models/Zone.js";
import PaymentTransaction from "../models/PaymentTransaction.model.js";
import { Types } from "mongoose";
import mongoose from "mongoose";
import { point as turfPoint, booleanPointInPolygon } from "@turf/turf";

dotenv.config();

const PaymentStatusFilterController =  async (req, res) => {

    try {

        const {status} = req.query;
        if (!status) {
            return res.status(400).json({ success: false, error: "Status query parameter is required" });
        }

        // Validate the status value
        const validStatuses = ["Pending", "Paid", "Failed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: "Invalid status value. Valid values are: Pending, Paid, Failed" });
        }

        const paymentTransactions = await PaymentTransaction.find({ paymentStatus: status })
          

        console.log("Payment transactions fetched successfully:", paymentTransactions);

        return res.status(200).json({ success: true, data: paymentTransactions });
        
    } catch (error) {
        console.error("Error in PaymentStatusFilterController:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
        
    }

}

const PaymentServicePlancontroller = async (req, res) => {
    try {
        
        const {zoneId,planId }= req.query;
        console.log("Received zoneId:", zoneId);
       
        console.log("Received planId:", planId);
        if (!planId) {
            return res.status(400).json({ success: false, error: "Plan ID query parameter is required" });
        }

        const paymentTransactions = await PaymentTransaction.find({
            planId:new mongoose.Types.ObjectId(planId),
            zoneId: new mongoose.Types.ObjectId(zoneId) 
        },)

        console.log("Payment transactions for plan ID fetched successfully:", paymentTransactions);

        return res.status(200).json({ success: true, data: paymentTransactions });

        



    } catch (error) {
        console.error("Error in PaymentServicePlancontroller:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

export const getFilteredPaymentData = async (req, res) => {
  const {  method } = req.query;

  const filter = {};



  if (method) {
    filter.method = method.toLowerCase(); // assuming you store it in lowercase: "upi", "card", "wallet"
  }

  try {
    const transactions = await PaymentTransaction.find(filter);

    res.status(200).json({
      success: true,
      total: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error("Error filtering payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};






export default {PaymentStatusFilterController, PaymentServicePlancontroller,getFilteredPaymentData};
