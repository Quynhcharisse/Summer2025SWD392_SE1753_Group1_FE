import Home from "../components/pages/Home";
import MainLayout from "../layouts/MainLayout.jsx";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import ProtectRouter from "@api/ProtectRouter.jsx";
import Login from "../components/pages/Login.jsx";
import Admission from "@components/pages/Admission.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <MainLayout>
                <Home/>
            </MainLayout>
        ),
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/admission",
        element: (
            <ProtectRouter allowedRoles={["ADMISSION"]}>
                <MainLayout>

                </MainLayout>
            </ProtectRouter>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/admission/view/profile"/> //vô thẳng elenment default
            },
            {
                path: 'view/profile',
                element:   <Admission/>
            }
        ]
    },
    {
        path: "*",
        element: (
            <MainLayout>
                <Login/>
            </MainLayout>
        ),
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router}/>;
}
