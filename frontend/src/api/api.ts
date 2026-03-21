import axios from "axios";
import { env } from "../config/env";

export const Axios = axios.create({
    baseURL: env.VITE_BACKEND_URL,
    withCredentials: true
})