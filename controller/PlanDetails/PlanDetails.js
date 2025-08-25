import Plan from "../../models/PlanDetails.js";

// Create Plan
export const createPlan = async (req, res) => {
  try {
    // Validate request body
    const {  PlanName, Duration, MRP, PrimaryUploadSpeedMbps, PrimaryDownloadSpeedMbps , planType} = req.body;
    if (!PlanName || !Duration || !MRP || !PrimaryUploadSpeedMbps || !PrimaryDownloadSpeedMbps || !planType) {
      return res.status(400).json({ message: "All fields are required" });  
    }
    // Create new plan
    const total = await Plan.countDocuments();

    console.log(total)
    let NewSrNo = total + 1; // Auto-increment SrNo based on current count
    req.body.SrNo = NewSrNo; // Assign SrNo to request body

    const plan = new Plan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Plans
export const getAllPlans = async (req, res) => {
  try {
    // get query params or set defaults
    const page = parseInt(req.query.page) || 1;    // default page 1
    const limit = parseInt(req.query.limit) || 10; // default 10 per page

    const skip = (page - 1) * limit;

    // get total count
    const total = await Plan.countDocuments();

    

    // fetch paginated data
    const plans = await Plan.find()
      .skip(skip)
      .limit(limit);

    res.json({
      total,                // total records
      page,                 // current page
      limit,                // records per page
      totalPages: Math.ceil(total / limit),
      data: plans           // actual plans
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get Plan by ID
export const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Plan by ID
export const updatePlan = async (req, res) => {
  try {
    const updated = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Plan not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Plan by ID
export const deletePlan = async (req, res) => {
  try {
    const deleted = await Plan.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Plan not found" });
    res.json({ message: "Plan deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete All Plans
export const deleteAllPlans = async (req, res) => {
  try {
    await Plan.deleteMany();
    res.json({ message: "All plans deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update by SrNo
export const updatePlanBySrNo = async (req, res) => {
  try {
    const updated = await Plan.findOneAndUpdate(
      { SrNo: req.params.srNo },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Plan not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
