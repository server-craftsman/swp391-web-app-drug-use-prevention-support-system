import type { CartItemStatus } from "../../app/enums/cartItemStatus.enum";

export interface CartItem {
  cartId: string;
  courseId: string;
  courseName: string;
  courseImageUrl: string;
  price: number;
  discount: number;
  status: CartItemStatus;
  createdAt: string;
}
