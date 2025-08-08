import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import axios from "axios";
import IspUser from "../models/ISP_User.js";
dotenv.config();





export const createIspAccount = async (req, res) => {
  try {
    const {
      name, email, phoneNumber, dob,
      serviceNeeded, address, amount,
      city, state, nation, zipCode,
      duration, PlanName, serviceCharge,
      accountId, userGroupId
    } = req.body;

    console.log("Received request body:", req.body);

    // Validate required fields
    if (
      !name || !email || !phoneNumber || !dob || !serviceNeeded || !address ||
      !city || !state || !nation || !zipCode || !amount || !duration ||
      !PlanName || !serviceCharge || !accountId || !userGroupId
    ) {
      return res.status(400).json({
        success: false,
        error: "All fields are required"
      });
    }

    // Validate numeric userGroupId
    const userGroupIdNumeric = Number(userGroupId);
    if (isNaN(userGroupIdNumeric)) {
      return res.status(400).json({
        success: false,
        error: "userGroupId must be a valid number"
      });
    }

    // ✅ Check for duplicate by email + phoneNumber
    const existingUser = await IspUser.findOne({
      email: email,
      phoneNumber: phoneNumber
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email and phone number"
      });
    }

    const userName = email.split('@')[0]; // Extract username from email
    console.log("Generated userName:", userName);

    // Save to local DB
    const ISP_ACCOUNT = new IspUser({
      name,
      email,
      phoneNumber,
      dob,
      serviceNeeded,
      address,
      amount,
      city,
      state,
      nation,
      zipCode,
      duration,
      planId: userGroupIdNumeric,
      PlanName,
      userGroupId: userGroupIdNumeric,
      serviceCharge,
      accountId,
      userName
    });

    await ISP_ACCOUNT.save();
    console.log("ISP account saved locally");

    // Prepare external API request
    const endpoint = 'https://live.nedataa.com';
    const url = `${endpoint}/api/v1/add_user`;
    const username = 'airwire';
    const password = 'aef187f09e5f4b94996eeac4581962e1ebeb6293';

    const body = {
      userName,
      userGroupId: userGroupIdNumeric,
      accountId,
      phoneNumber,
      emailId: email,
      firstName: name,
      address_city: city,
      address_state: state,
      address_pin: zipCode,
      address_country: nation,
      address,
      overrideAmount: amount,
    };

    try {
      const response = await axios.post(url, body, {
        auth: { username, password }
      });

      console.log('External user creation response:', response.data);

      if (response.data?.status === 'error') {
        return res.status(500).json({
          success: false,
          error: "External API Error",
          details: response.data
        });
      }

      return res.status(200).json({
        success: true,
        message: "User created successfully",
        externalApiResponse: response.data
      });

    } catch (apiError) {
      console.error("Failed to create user on external API:", apiError?.response?.data || apiError.message);

      return res.status(500).json({
        success: false,
        error: "Failed to create user on external API",
        details: apiError?.response?.data || apiError.message
      });
    }

  } catch (error) {
    console.error("Unexpected server error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating account",
      error: error.message
    });
  }
};


export const getIspAccount = async (req, res) => {
  try {


    
  } catch (error) {
    console.error("Error fetching ISP account:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching account",
      error: error.message
    });
  }
}
