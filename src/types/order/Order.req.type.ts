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
