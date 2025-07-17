import UserOutOfTheLoccation from "../models/UserOutOfTheLoccation.js";
import axios from "axios";


const UserOutOfTheLocationController = async (req, res) => {
  try {
    const {
      name, email, phoneNumber, dob,
      serviceNeeded, address,
      city, state, nation, zipCode,
      planDetails
    } = req.body;

    // Validate required fields
    if (
      !name || !email || !phoneNumber || !dob || !serviceNeeded || !address ||
      !city || !state || !nation || !zipCode || !planDetails
    ) {
      return res.status(400).json({
        success: false,
        error: "All fields are required"
      });
    }

    // Validate phone number (Indian format: starts with 6-9, 10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        error: "Invalid phone number format"
      });
    }

    // Save user data
    const userOutOfLocation = new UserOutOfTheLoccation({
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
      planDetails
    });

    const savedUser = await userOutOfLocation.save();

    // Extract plan name safely
    const planName = planDetails?.planName || "N/A";

    // Build external payload
    const externalPayload = {
      Request: {
        requestDate: new Date().toISOString(),
        extTransactionId: savedUser._id,
        systemId: "priyads",
        password: "Priya@2025",
        UAN: "ggw0VGWp",
        UserType: "Staff"
      },
      Funnel: {
        Name: savedUser.name,
        Address: savedUser.address,
        ServiceType: 'Broadband',
        City: savedUser.city,
        State: savedUser.state,
        Nation: savedUser.nation,
        ZipCode: savedUser.zipCode,
        MobileNo: savedUser.phoneNumber,
        EMail: savedUser.email,
        Plan: planName,
        ReferralUserId: "",
        ReferralEmployeeName: "",
        ReferralEmployeeID: "",
        ReferralMobile: "",
        Source: "",
        ReferralCompanyId: "",
        NotificationReceive: "True"
      }
    };

    // Send POST request to external API
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

      const externalApiResult = response.data?.d || null;
       console.log("✅ External API response:", externalApiResult);

      // ✅ Save API response to DB
     savedUser.externalFunnelResponse = externalApiResult;
      await savedUser.save();
      console.log("✅ External API response:", response.data);
    } catch (apiError) {
      console.error("❌ Error calling external API:", apiError.message);
    }

    // Final success response
    return res.status(201).json({
      success: true,
      message: "User data saved successfully",
      data: savedUser
    });

  } catch (error) {
    console.error("Error saving user out of location:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};



const getAlluserOutOfLocationData = async (req, res) => {
  try {
    // Parse page and limit safely
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Count total documents
    const total = await UserOutOfTheLoccation.countDocuments();

    // Fetch paginated data (includes _id by default)
    const userOutOfLocation = await UserOutOfTheLoccation.find()
     .sort({ _id: -1 }) // Newest first using ObjectID
      

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
      count: userOutOfLocation.length,
      data: userOutOfLocation // each document will include _id
    });

  } catch (error) {
    console.error("Error fetching user out of location data:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};


const getUserByIdOutOfLocation = async (req, res) => {
    try {
        
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, error: "User ID is required" });
        }

        const user = await UserOutOfTheLoccation.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        return res.status(200).json({ success: true, data: user });

    } catch (error) {
        console.error("Error fetching user by ID out of location:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}


export const getUsersByCityOrState = async (req, res) => {
  try {
    const { city, state } = req.query;

    const filter = {};
    if (city) filter.city = city;
    if (state) filter.state = state;

    const users = await UserOutOfTheLoccation.find(filter);

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};



export const getZipCodeDistribution = async (req, res) => {
  try {
    const zipSummary = await UserOutOfTheLoccation.aggregate([
      {
        $group: {
          _id: "$zipCode",
          userCount: { $sum: 1 }
        }
      },
      {
        $sort: { userCount: -1 } // Optional: Sort by highest count
      }
    ]);

    res.status(200).json({
      success: true,
      summary: zipSummary.map(item => ({
        zipCode: item._id,
        userCount: item.userCount
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting zip code distribution",
      error: error.message
    });
  }
};

export const getCityDistribution = async (req, res) => {
  try {
    const citySummary = await UserOutOfTheLoccation.aggregate([
      {
        $group: {
          _id: "$city", // Group by city field
          userCount: { $sum: 1 }
        }
      },
      {
        $sort: { userCount: -1 } // Sort cities with most requests first
      }
    ]);

    res.status(200).json({
      success: true,
      summary: citySummary.map(item => ({
        city: item._id,
        userCount: item.userCount
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting city distribution",
      error: error.message
    });
  }
};

export const getStateDistribution = async (req, res) => {
  try {
    const stateSummary = await UserOutOfTheLoccation.aggregate([
      {
        $group: {
          _id: "$state", // Group by state field
          userCount: { $sum: 1 }
        }
      },
      {
        $sort: { userCount: -1 } // Sort by most user requests
      }
    ]);

    res.status(200).json({
      success: true,
      summary: stateSummary.map(item => ({
        state: item._id,
        userCount: item.userCount
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting state distribution",
      error: error.message
    });
  }
};




export default { UserOutOfTheLocationController, 
                 getAlluserOutOfLocationData,
                 getUserByIdOutOfLocation ,
                 getUsersByCityOrState,
                 getZipCodeDistribution,
                 getCityDistribution,
                 getStateDistribution
                
                };
