export interface ICartItem {
  productId: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface ICart {
  items: ICartItem[];
}
