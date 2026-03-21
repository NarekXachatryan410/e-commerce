import { createBrowserRouter } from "react-router-dom";
import Menu from "../pages/Menu";
import "../index.css"
import Login from "../pages/Login";
import ProtectedRoute from "../ProtectedRoute";
import AdminDashboard from "../pages/AdminDashboard";
import SignUp from "../pages/SignUp";

export const router = createBrowserRouter([
    {path: '/', element: <Menu/>},
    {path: '/login', element: <Login/>},
    {path: '/signup', element: <SignUp/>},
    {path: '/admin', element: <ProtectedRoute adminOnly={true}/>, children: [
        {path: 'dashboard', element: <AdminDashboard />}
    ]}
]) 
