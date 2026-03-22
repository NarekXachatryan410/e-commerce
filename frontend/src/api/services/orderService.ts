import { Axios } from "../api";
import type { ApiResponse } from "../types";
import type { IOrder } from "../../types/order";

class OrderService {
  async createOrder() {
    const response = await Axios.post<ApiResponse<IOrder>>("/orders");
    return response.data;
  }

  async getMyOrders() {
    const response = await Axios.get<ApiResponse<IOrder[]>>("/orders/my");
    return response.data;
  }
}

export default new OrderService();
