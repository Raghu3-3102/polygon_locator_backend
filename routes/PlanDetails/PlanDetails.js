import {createPlan,getAllPlans,getPlanById,updatePlan,deletePlan,deleteAllPlans,updatePlanBySrNo } from '../../controller/PlanDetails/PlanDetails.js';
import express from "express";
const router = express.Router();
// Ensure you have the auth middleware for protected routes


router.post("/create", createPlan);
router.get("/getAll", getAllPlans);
router.get("/get/:id", getPlanById);
router.put("/update/:id", updatePlan);
router.delete("/delete/:id", deletePlan);
router.delete("/deleteAll", deleteAllPlans);
router.put("/updateSrNo/:srNo", updatePlanBySrNo);




export default  router;
