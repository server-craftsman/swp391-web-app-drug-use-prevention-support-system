import { useMutation } from "@tanstack/react-query";
import { OrderService } from "../services/order/order.service";
import type {
  ChangeOrderStatusRequest,
  CreateOrderRequest,
} from "../types/order/Order.req.type";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../consts/router.path.const";
import { helpers } from "../utils";

/**
 * Hook for createOrder
 */
export const useCreateOrder = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => OrderService.createOrder(data),
    onSuccess: () => {
      helpers.notificationMessage("Tạo đơn hàng thành công", "success");
      navigate(ROUTER_URL.CLIENT.PAYMENT);
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};
/*
Hook for UpdateOrderStatus
*/
export const useUpdateOrderStatus = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: ChangeOrderStatusRequest) =>
      OrderService.changeOrderStatus(data),
    onSuccess: () => {
      helpers.notificationMessage("hủy thanh toán thành công", "success");
      navigate(ROUTER_URL.CLIENT.COURSE);
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};
