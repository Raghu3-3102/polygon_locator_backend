import express from "express";
const router = express.Router();
import zoneRouters from "./zoneRoutes/zoneRoutes.js"

const defaultRoutes = [
    {
        path: "/zone",
        route: zoneRouters
    },
    
];

defaultRoutes.forEach(({ path, route }) => {
    router.use(path, route);
});

export default router;