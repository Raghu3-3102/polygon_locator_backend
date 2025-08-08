import {AddLeadAcc} from '../../controller/AddLead.js';
import express from "express";
const router = express.Router();
// Ensure you have the auth middleware for protected routes


router.post("/add",AddLeadAcc);




export default  router;
