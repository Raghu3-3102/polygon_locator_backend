import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import axios from "axios";
import AddLead from "../models/Add_Lead.js";
dotenv.config();




export const AddLeadAcc = async (req, res) => {
  try {
    const {
      name, email, phoneNumber, dob,
      serviceNeeded, address, amount,
      city, state, nation, zipCode,
      duration, PlanName, serviceCharge,
      accountId, userGroupId, latitude, longitude
    } = req.body;

    // ✅ Check if lead already exists by email and phone
    const existingLead = await AddLead.findOne({
      email: email,
      phoneNumber: phoneNumber
    });

    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: "Lead already exists with this email and phone number"
      });
    }

    // External API request
    const endpoint = 'https://live.nedataa.com';
    const url = `${endpoint}/api/v1/add_lead`;
    const username = 'airwire';
    const password = 'aef187f09e5f4b94996eeac4581962e1ebeb6293';

    const apiBody = {
      firstName: name,
      phoneNumber,
      emailId: email,
      address_city: city,
      address_state: state,
      address_pin: zipCode,
      address_country: nation,
      lead_latitude: latitude,
      lead_longitude: longitude,
      address,
    };

    const response = await axios.post(url, apiBody, {
      auth: { username, password }
    });

    // Save to DB including API response
    const Add_Lead = new AddLead({
      name, email, phoneNumber, dob,
      serviceNeeded, address, amount,
      city, state, nation, zipCode,
      duration, PlanName, serviceCharge,
      accountId, userGroupId: Number(userGroupId),
      latitude, longitude,
      rawResponse: response.data // ✅ Save whole API response
    });

    await Add_Lead.save();

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      externalApiResponse: response.data
    });

  } catch (error) {
    console.error("Error creating lead:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

