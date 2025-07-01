import RazorPayAdmin from '../../controller/RazorPayAdmin.js';
import express from "express";
const router = express.Router();





router.post('/', RazorPayAdmin.createAdmin);
router.get('/', RazorPayAdmin.getAllAdmins);
router.get('/:id', RazorPayAdmin.getAdminById);
router.put('/:id', RazorPayAdmin.updateAdmin);    // Full update
router.patch('/:id', RazorPayAdmin.updateAdmin);  // Partial update
router.delete('/:id', RazorPayAdmin.deleteAdmin);

export default  router;
