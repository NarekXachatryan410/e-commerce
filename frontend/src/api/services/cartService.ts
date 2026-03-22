import { Axios } from "../api";
import type { ApiResponse } from "../types";
import type { ICart } from "../../types/cart";

class CartService {
  async getMyCart() {
    const response = await Axios.get<ApiResponse<ICart>>("/cart/my");
    return response.data;
  }

  async addItem(productId: string) {
    const response = await Axios.post<ApiResponse<ICart>>("/cart/items", { productId });
    return response.data;
  }

  async removeItem(productId: string) {
    const response = await Axios.delete<ApiResponse<ICart>>(`/cart/items/${productId}`);
    return response.data;
  }
}

export default new CartService();
