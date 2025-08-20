import express from "express";
const router = express.Router();
import zoneRouters from "./zoneRoutes/zoneRoutes.js"
import zonePaymentRouters from "./ZonePaymentRoutes/ZonePayment.js";
import RazorPayAdminRouters from   "./RazorPayAdminRoute/RazorPayAdmin.js";
import userAuthRoutes from "./UserAuth/UserAuthRoutes.js";
import UserOutOfTheLocationRouter from "./UserOutOfTheLocationRouter/UserOutOfTheLocationRoute.js";
import servicecePlan from "./ServicePlanCharge/ServicePlanCharge.js";
import new_flow from "./New_Flow/New_flow.js";
import ISP_ACCOUNT from "./ISP_ACCOUNT/IspUserRouter.js";
import Addlead from "./Add_Lead/AddLead.js";
import PlanDetailsRouter from "./PlanDetails/PlanDetails.js";

const defaultRoutes = [
    {
        path: "/zone",
        route: zoneRouters
    },
     {
        path: "/zone-payment",
        route: zonePaymentRouters
    },
      {
        path: "/Admin-RazorPay",
        route: RazorPayAdminRouters
      
    },
    {
        path: "/user-auth",
        route: userAuthRoutes

    },
     {
        path: "/user-out-of-location",
        route: UserOutOfTheLocationRouter

    },
     {
        path: "/service-Charge",
        route: servicecePlan

    },
     {
        path: "/plan",
        route: new_flow

    },
    {
        path: "/ISP",
        route: ISP_ACCOUNT

    },
    {
        path: "/lead",
        route:  Addlead

    },
    {
        path: "/PlanData",
        route:  PlanDetailsRouter

    }
    
];

defaultRoutes.forEach(({ path, route }) => {
    router.use(path, route);
});

export default router;