import { createBrowserRouter } from "react-router-dom";
import Menu from "../pages/Menu";
import "../index.css"

export const router = createBrowserRouter([
    {path: '/', element: <Menu/>}
]) 