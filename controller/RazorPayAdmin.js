import RazorpayAdmin from "../models/RazorPayAdmin.js";

// CREATE
const createAdmin = async (req, res) => {
  try {
    const admin = new RazorpayAdmin(req.body);
    await admin.save();
    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ ALL
const getAllAdmins = async (req, res) => {
  try {
    const admins = await RazorpayAdmin.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ ONE
const getAdminById = async (req, res) => {
  try {
    const admin = await RazorpayAdmin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE (PUT or PATCH)
const updateAdmin = async (req, res) => {
  try {
    const updated = await RazorpayAdmin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Admin not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE
const deleteAdmin = async (req, res) => {
  try {
    const deleted = await RazorpayAdmin.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Admin not found" });
    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export default  {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin
};
