import userAuth from "../../controller/UserOutOfTheLocation.js";
import express from "express";
const router = express.Router();
import protect from "../../middleware/authMiddleware.js";

router.post("/create", userAuth.UserOutOfTheLocationController);
router.get("/get",protect, userAuth.getAlluserOutOfLocationData);
router.get("/get/:id", userAuth.getUserByIdOutOfLocation);
router.get("/location",protect, userAuth.getUsersByCityOrState);
router.get("/zip-distribution",protect, userAuth.getZipCodeDistribution);
router.get("/city-distribution",protect, userAuth.getCityDistribution);
router.get("/state-distribution",protect, userAuth.getStateDistribution);


export default router;