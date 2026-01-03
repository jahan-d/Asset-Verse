import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import JoinEmployee from "../pages/JoinEmployee";
import JoinHR from "../pages/JoinHR";
import AddAsset from "../pages/hr/AddAsset";
import AssetList from "../pages/hr/AssetList";
import AllRequests from "../pages/hr/AllRequests";
import PrivateRoute from "./PrivateRoute";
import HRRoute from "./HRRoute";
import MyAssets from "../pages/employee/MyAssets";
import RequestAsset from "../pages/employee/RequestAsset";
import MyTeam from "../pages/employee/MyTeam";
import UpgradePackage from "../pages/hr/UpgradePackage";
import MyEmployeeList from "../pages/hr/MyEmployeeList";
import Profile from "../pages/Profile";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/join-employee",
                element: <JoinEmployee />
            },
            {
                path: "/join-hr",
                element: <JoinHR />
            },
            // HR Routes
            {
                path: "/hr/add-asset",
                element: <PrivateRoute><HRRoute><AddAsset /></HRRoute></PrivateRoute>
            },
            {
                path: "/hr/assets",
                element: <PrivateRoute><HRRoute><AssetList /></HRRoute></PrivateRoute>
            },
            {
                path: "/hr/requests",
                element: <PrivateRoute><HRRoute><AllRequests /></HRRoute></PrivateRoute>
            },
            {
                path: "/hr/upgrade",
                element: <PrivateRoute><HRRoute><UpgradePackage /></HRRoute></PrivateRoute>
            },
            {
                path: "/hr/my-employees",
                element: <PrivateRoute><HRRoute><MyEmployeeList /></HRRoute></PrivateRoute>
            },
            {
                path: "/profile",
                element: <PrivateRoute><Profile /></PrivateRoute>
            },
            // Employee Routes
            {
                path: "/my-assets",
                element: <PrivateRoute><MyAssets /></PrivateRoute>
            },
            {
                path: "/request-asset",
                element: <PrivateRoute><RequestAsset /></PrivateRoute>
            },
            {
                path: "/my-team",
                element: <PrivateRoute><MyTeam /></PrivateRoute>
            }
        ]
    },
]);

export default router;
