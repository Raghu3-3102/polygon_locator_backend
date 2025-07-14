import userAuth from "../../controller/UserOutOfTheLocation.js";
import express from "express";
const router = express.Router();

router.post("/create", userAuth.UserOutOfTheLocationController);
router.get("/get", userAuth.getAlluserOutOfLocationData);
router.get("/get/:id", userAuth.getUserByIdOutOfLocation);

export default router;