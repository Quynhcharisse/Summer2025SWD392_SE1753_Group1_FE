import Admission from "@/components/pages/Admission";
import Home from "@/components/pages/Home";
import Login from "@/components/pages/Login";
import NotFound from "@/components/pages/NotFound";
import MainLayout from "@/layouts/MainLayout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout>
        <Home />
      </MainLayout>
    ),
  },
  {
    path: "/admission",
    element: (
      <MainLayout>
        <Admission />
      </MainLayout>
    ),
  },
  {
    path: "/login",
    element: (
      
        <Login />
      
    ),
  },
  {
    path: "*",
    element: (
      <MainLayout>
        <NotFound />
      </MainLayout>
    ),
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
