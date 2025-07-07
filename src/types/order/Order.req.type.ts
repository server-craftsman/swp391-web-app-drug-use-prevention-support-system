import type { OrderStatus } from "../../app/enums/orderStatus.enum";

export interface OrderRequest {
  pageNumber: number;
  pageSize: number;
}
export interface CreateOrderRequest {
  selectedCartItemIds: string[];
}
export interface OrderDetailRequest {
  orderId: string;
}
export interface ChangeOrderStatusRequest {
  orderId: string;
  newStatus: OrderStatus;
}
export interface MyOrderRequest {
  pageNumber: number;
  pageSize: number;
}
