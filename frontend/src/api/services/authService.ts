import type { IAuthResponse, ISignupPayload } from "../../types/auth";
import { Axios } from "../api";
import type { ApiResponse } from "../types";

class AuthService {
    async login(username: string, password: string) {
        const response = await Axios.post<ApiResponse<IAuthResponse>>('/auth/login', { username, password })
        return response.data
    }

    async signup(payload: ISignupPayload) {
        const response = await Axios.post<ApiResponse<IAuthResponse>>('/auth/signup', payload)
        return response.data
    }

    async logout() {
        await Axios.post('/auth/logout')
    }
}

export default new AuthService;
