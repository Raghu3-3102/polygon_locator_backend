import RazorPayAdmin from '../../controller/RazorPayAdmin.js';
import express from "express";
const router = express.Router();
import protect from "../../middleware/authMiddleware.js"; // Ensure you have the auth middleware for protected routes





router.post('/',protect, RazorPayAdmin.createAdmin);
router.get('/',protect, RazorPayAdmin.getAllAdmins);
router.get('/:id',protect, RazorPayAdmin.getAdminById);
router.put('/:id',protect, RazorPayAdmin.updateAdmin);    // Full update
router.patch('/:id',protect, RazorPayAdmin.updateAdmin);  // Partial update
router.delete('/:id',protect, RazorPayAdmin.deleteAdmin);

export default  router;
