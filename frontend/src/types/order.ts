export interface IOrderItemPayload {
  productId: string;
  quantity: number;
}

export interface IOrderItem {
  productId: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface IOrder {
  _id: string;
  items: IOrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
}
