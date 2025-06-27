export interface CartItem {
  cartId: string;
  courseId: string;
  courseName: string;
  courseImageUrl: string;
  price: number;
  discount: number;
  status: "Pending" | "Completed" | "Cancelled";
  createdAt: string;
}
