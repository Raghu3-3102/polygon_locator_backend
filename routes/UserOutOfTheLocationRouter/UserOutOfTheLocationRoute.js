import userAuth from "../../controller/UserOutOfTheLocation.js";
import express from "express";
const router = express.Router();

router.post("/create", userAuth.UserOutOfTheLocationController);
router.get("/get", userAuth.getAlluserOutOfLocationData);
router.get("/get/:id", userAuth.getUserByIdOutOfLocation);
router.get("/location", userAuth.getUsersByCityOrState);
router.get("/zip-distribution", userAuth.getZipCodeDistribution);
router.get("/city-distribution", userAuth.getCityDistribution);
router.get("/state-distribution", userAuth.getStateDistribution);


export default router;