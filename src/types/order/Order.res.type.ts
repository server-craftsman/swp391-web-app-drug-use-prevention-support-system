export interface OrderResponse {
  orderId: string;
  userId: string;
  userName: string;
  totalAmount: number;
  orderDate: string;
  paymentStatus: string;
  paymentId: string;
  orderStatus: string;
  orderDetails: OrderDetail[];
}
export interface OrderDetail {
  orderDetailId: string;
  courseId: string;
  courseName: string;
  amount: number;
}
