import {createIspAccount} from '../../controller/IspUserController.js';
import express from "express";
const router = express.Router();
// Ensure you have the auth middleware for protected routes


router.post("/add",createIspAccount);




export default  router;
