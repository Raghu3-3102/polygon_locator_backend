import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();


export const getAlldataoflead = async (req, res) => {

  try {
    console.log("Fetching all data...");


const endpoint = 'https://live.nedataa.com'; // replace with actual endpoint
const visable = 'true'; // or whatever value is needed
const username = 'airwire';
const password = 'aef187f09e5f4b94996eeac4581962e1ebeb6293';

const url = `${endpoint}/api/v1/get_all_profile_ids/${visable}`;

const resp = await axios.get(url, {
  auth: {
    username,
    password
  }
})
.then(response => {
  
  return response.data; // Return the data from the response
})
.catch(error => {
  console.error('Error:', error.response?.data || error.message);
});



    res.status(200).json({ success: true, data: resp });


    
  } catch (error) {
    console.error("Error fetching all data:", error);
    res.status(500).json({ success: false, message: "Server error while fetching data" });
    
  }

}



export const getAlldatabyid = async (req, res) => {
  try {
    console.log("Fetching profile details for given IDs...");

    const { profileIds } = req.body;

    if (!Array.isArray(profileIds) || profileIds.length === 0) {
      return res.status(400).json({ success: false, message: "profileIds must be a non-empty array" });
    }

    const endpoint = 'https://live.nedataa.com';
    const username = 'airwire';
    const password = 'aef187f09e5f4b94996eeac4581962e1ebeb6293';

    const results = [];

    for (const id of profileIds) {
      const url = `${endpoint}/api/v1/get_profile_details/${id}`;
      try {
        const response = await axios.get(url, {
          auth: {
            username,
            password
          }
        });
        results.push({ id, data: response.data });
      } catch (err) {
        console.error(`Error fetching profile ${id}:`, err.message);
        results.push({ id, error: err.response?.data || err.message });
      }
    }

    res.status(200).json({ success: true, data: results });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, message: "Server error while processing request" });
  }
};










