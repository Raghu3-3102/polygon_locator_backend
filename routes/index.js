import express from "express";
const router = express.Router();
import zoneRouters from "./zoneRoutes/zoneRoutes.js"
import zonePaymentRouters from "./ZonePaymentRoutes/ZonePayment.js";
import RazorPayAdminRouters from   "./RazorPayAdminRoute/RazorPayAdmin.js";
import userAuthRoutes from "./UserAuth/UserAuthRoutes.js";


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

    }
    
];

defaultRoutes.forEach(({ path, route }) => {
    router.use(path, route);
});

export default router;