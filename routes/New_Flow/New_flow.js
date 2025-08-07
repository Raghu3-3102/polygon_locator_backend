import {getAlldataoflead,getAlldatabyid} from '../../controller/New_Flow_Api_Call.js';
import express from "express";
const router = express.Router();
// Ensure you have the auth middleware for protected routes


router.post("/get-Ids",getAlldataoflead );
router.post("/get-all-profile", getAlldatabyid);



export default  router;
