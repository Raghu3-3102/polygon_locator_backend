import ServiceChargePlan from "../models/serviceCharge.js";// Adjust the path as necessary



export const setServiceThrisold = async (req, res) => {
  try {
    const { lowerThreshold, upperThreshold, serviceCharge } = req.body;

    if (
      typeof lowerThreshold !== "number" ||
      typeof upperThreshold !== "number" ||
      typeof serviceCharge !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields must be numbers"
      });
    }

    if (lowerThreshold >= upperThreshold) {
      return res.status(400).json({
        success: false,
        message: "lowerThreshold must be less than upperThreshold"
      });
    }

    // Overlap check
    const overlappingSlab = await ServiceChargePlan.findOne({
      $or: [
        {
          lowerThreshold: { $lt: upperThreshold },
          upperThreshold: { $gt: lowerThreshold }
        }
      ]
    });

    if (overlappingSlab) {
      return res.status(409).json({
        success: false,
        message: "Overlap detected with an existing slab",
        conflict: overlappingSlab
      });
    }

    const newSlab = new ServiceChargePlan({
      lowerThreshold,
      upperThreshold,
      serviceCharge
    });

    await newSlab.save();

    return res.status(201).json({
      success: true,
      message: "Service charge slab created successfully",
      data: newSlab
    });
  } catch (error) {
    console.error("Error setting service threshold:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const editServiceThreshold = async (req, res) => {
  try {
    const { id } = req.params;
    const { lowerThreshold, upperThreshold, serviceCharge } = req.body;

    const slab = await ServiceChargePlan.findById(id);
    if (!slab) {
      return res.status(404).json({ success: false, message: "Slab not found" });
    }

    if (
      typeof lowerThreshold !== "number" ||
      typeof upperThreshold !== "number" ||
      typeof serviceCharge !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields must be numbers"
      });
    }

    if (lowerThreshold >= upperThreshold) {
      return res.status(400).json({
        success: false,
        message: "lowerThreshold must be less than upperThreshold"
      });
    }

    // Overlap check (excluding current slab)
    const overlappingSlab = await ServiceChargePlan.findOne({
      _id: { $ne: id },
      $or: [
        {
          lowerThreshold: { $lt: upperThreshold },
          upperThreshold: { $gt: lowerThreshold }
        }
      ]
    });

    if (overlappingSlab) {
      return res.status(409).json({
        success: false,
        message: "Overlap detected with an existing slab",
        conflict: overlappingSlab
      });
    }

    slab.lowerThreshold = lowerThreshold;
    slab.upperThreshold = upperThreshold;
    slab.serviceCharge = serviceCharge;

    await slab.save();

    return res.status(200).json({
      success: true,
      message: "Slab updated successfully",
      data: slab
    });
  } catch (error) {
    console.error("Error updating slab:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const getAllSlabs = async (req, res) => {
  try {
    const slabs = await ServiceChargePlan.find().sort({ lowerThreshold: 1 });

    return res.status(200).json({
      success: true,
      data: slabs
    });
  } catch (error) {
    console.error("Error fetching slabs:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSlabById = async (req, res) => {
  try {
    const { id } = req.params;
    const slab = await ServiceChargePlan.findById(id);

    if (!slab) {
      return res.status(404).json({ success: false, message: "Slab not found" });
    }

    return res.status(200).json({
      success: true,
      data: slab
    });
  } catch (error) {
    console.error("Error fetching slab:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteSlab = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ServiceChargePlan.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Slab not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Slab deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting slab:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};






export default   { setServiceThrisold,editServiceThreshold, getAllSlabs, getSlabById, deleteSlab};