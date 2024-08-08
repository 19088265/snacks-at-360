export interface Order {
  orderId: string;
  userId: string;
  email: string;
  username: string;
  products: { productId: string, quantity: number, productName: string, productPrice: number }[];
  total: number;
  date: Date;
}

