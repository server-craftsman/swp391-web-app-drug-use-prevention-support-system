import { useMutation } from "@tanstack/react-query";
import { CartService } from "../services/cart/cart.service";
import type {
  AddToCartRequest,
  ViewCartRequest,
} from "../types/cart/Cart.req.type";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../consts/router.path.const";
import { helpers } from "../utils";
/**
 * Hook for use addCartItem
 */
export const useAddCartItem = () => {
  return useMutation({
    mutationFn: (data: AddToCartRequest) => CartService.addCartItem(data),
    onSuccess: () => {
      helpers.notificationMessage("Thêm vào giỏ hàng thành công!", "success");
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};

/**
 * Hook for use getCartItems
 */
export const useGetCartItems = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: ViewCartRequest) => CartService.getCartItems(data),
    onSuccess: () => {
      navigate(ROUTER_URL.CLIENT.CART);
    },
    onError: (error) => {
      helpers.notificationMessage(error.message, "error");
    },
  });
};
