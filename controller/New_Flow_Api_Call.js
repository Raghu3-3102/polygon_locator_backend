import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();


export const getAlldataoflead = async (req, res) => {
  try {
    console.log("Fetching all profile data...");

    const endpoint = 'https://live.nedataa.com';
    const visable = 'true';
    const username = 'airwire';
    const password = 'aef187f09e5f4b94996eeac4581962e1ebeb6293';
    const url = `${endpoint}/api/v1/get_all_profile_ids/${visable}`;

    const response = await axios.get(url, {
      auth: { username, password }
    });

    if (!response?.data) {
      return res.status(500).json({
        success: false,
        message: "No data received from external API"
      });
    }

    console.log("Data fetched successfully.");
    return res.status(200).json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error("Error fetching data:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching data from external API",
      error: error?.response?.data || error.message
    });
  }
};





export const getAlldatabyid = async (req, res) => {
  try {
    console.log("Fetching profile details for given IDs...");

    const { profileIds } = req.body;

    if (!Array.isArray(profileIds) || profileIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "profileIds must be a non-empty array"
      });
    }

    const endpoint = 'https://live.nedataa.com';
    const username = 'airwire';
    const password = 'aef187f09e5f4b94996eeac4581962e1ebeb6293';

    const results = [];

    for (const id of profileIds) {
      const url = `${endpoint}/api/v1/get_profile_details/${id}`;
      try {
        const response = await axios.get(url, {
          auth: { username, password }
        });

        results.push({ id, success: true, data: response.data });

      } catch (err) {
        console.error(`Error fetching profile ${id}:`, err.response?.data || err.message);
        results.push({
          id,
          success: false,
          error: err.response?.data || err.message
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetch completed",
      data: results
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while processing request",
      error: error.message
    });
  }
};










