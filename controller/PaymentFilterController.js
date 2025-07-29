import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Zone from "../models/Zone.js";
import PaymentTransaction from "../models/PaymentTransaction.model.js";
import { Types } from "mongoose";
import mongoose from "mongoose";
import { point as turfPoint, booleanPointInPolygon } from "@turf/turf";
import moment from "moment"; // Make sure moment is installed

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



const TotalPaidCustomer = async (req, res) => {
  try {
    const now = moment(); // current date
    const startOfThisWeek = now.clone().startOf("isoWeek");
    const startOfLastWeek = startOfThisWeek.clone().subtract(1, "weeks");
    const endOfLastWeek = startOfThisWeek.clone().subtract(1, "days").endOf("day");

    // Total Paid Customers (all time)
    const totalPaidCustomers = await PaymentTransaction.countDocuments({ paymentStatus: "Paid" });

    // This Week Paid Customers
    const thisWeekPaid = await PaymentTransaction.countDocuments({
      paymentStatus: "Paid",
      createdAt: { $gte: startOfThisWeek.toDate(), $lte: now.toDate() }
    });

    // Last Week Paid Customers
    const lastWeekPaid = await PaymentTransaction.countDocuments({
      paymentStatus: "Paid",
      createdAt: { $gte: startOfLastWeek.toDate(), $lte: endOfLastWeek.toDate() }
    });

    let percentageGrowth = 0;
    let status = "No Change";

    if (lastWeekPaid === 0 && thisWeekPaid > 0) {
      percentageGrowth = thisWeekPaid * 100;
      status = "Growth";
    } else if (thisWeekPaid === 0 && lastWeekPaid > 0) {
      percentageGrowth = -lastWeekPaid * 100;
      status = "Decline";
    } else if (lastWeekPaid > 0) {
      const diff = thisWeekPaid - lastWeekPaid;
      percentageGrowth = (diff / lastWeekPaid) * 100;
      status = diff >= 0 ? "Growth" : "Decline";
    }

    return res.status(200).json({
      success: true,
      totalPaidCustomers,
      thisWeekPaid,
      lastWeekPaid,
      percentageGrowth: `${percentageGrowth.toFixed(2)}%`,
      status
    });
  } catch (error) {
    console.error("Error in TotalPaidCustomer:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};




const TotalPendingCustomer = async (req, res) => {
  try {
    const todayStart = moment().startOf("day");
    const todayEnd = moment().endOf("day");

    const yesterdayStart = moment().subtract(1, "days").startOf("day");
    const yesterdayEnd = moment().subtract(1, "days").endOf("day");

    const todayPending = await PaymentTransaction.countDocuments({
      paymentStatus: "Pending",
      createdAt: { $gte: todayStart.toDate(), $lte: todayEnd.toDate() }
    });

    const yesterdayPending = await PaymentTransaction.countDocuments({
      paymentStatus: "Pending",
      createdAt: { $gte: yesterdayStart.toDate(), $lte: yesterdayEnd.toDate() }
    });

    let percentageChange = "0.00%";
    let status = "No Change";

    if (yesterdayPending === 0 && todayPending > 0) {
      percentageChange = `${(todayPending * 100).toFixed(2)}%`;
      status = "Growth";
    } else if (yesterdayPending > 0 && todayPending === 0) {
      percentageChange = `${(-yesterdayPending * 100).toFixed(2)}%`;
      status = "Decline";
    } else if (yesterdayPending > 0) {
      const change = ((todayPending - yesterdayPending) / yesterdayPending) * 100;
      percentageChange = `${change.toFixed(2)}%`;
      status = change > 0 ? "Growth" : change < 0 ? "Decline" : "No Change";
    }

    return res.status(200).json({
      success: true,
      todayPending,
      yesterdayPending,
      percentageChange,
      status
    });
  } catch (error) {
    console.error("Error in TotalPendingCustomer:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};



const getMonthlyTransactionStats = async (req, res) => {
  try {
    const now = new Date();

    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const thisMonthTotalRecord = await PaymentTransaction.countDocuments({
      createdAt: { $gte: startOfThisMonth },
    });

    const lastMonthTotalRecord = await PaymentTransaction.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    let percentageChange = "0.00%";
    let status = "Neutral";

    if (lastMonthTotalRecord === 0 && thisMonthTotalRecord > 0) {
      percentageChange = `${(thisMonthTotalRecord * 100).toFixed(2)}%`;
      status = "Growth";
    } else if (lastMonthTotalRecord > 0 && thisMonthTotalRecord === 0) {
      percentageChange = `${(-lastMonthTotalRecord * 100).toFixed(2)}%`;
      status = "Decline";
    } else if (lastMonthTotalRecord > 0 && thisMonthTotalRecord > 0) {
      const change = thisMonthTotalRecord - lastMonthTotalRecord;
      const percent = ((change / lastMonthTotalRecord) * 100).toFixed(2);
      percentageChange = `${percent}%`;
      status = change > 0 ? "Growth" : "Decline";
    }

    return res.status(200).json({
      success: true,
      thisMonthTotalRecord,
      lastMonthTotalRecord,
      percentageChange,
      status,
    });
  } catch (error) {
    console.error("Error in getMonthlyTransactionStats:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};








export default {PaymentStatusFilterController, PaymentServicePlancontroller,getFilteredPaymentData,getFilterdPymentByStatusAndMethod,TotalPaidCustomer,TotalPendingCustomer,getMonthlyTransactionStats};
