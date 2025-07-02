import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import { API_PATH } from "../../consts/api.path.const";
import type {
  AddToCartRequest,
  DeleteCartItemRequest,
  ViewCartRequest,
} from "../../types/cart/Cart.req.type";
import type { CartItem } from "../../types/cart/Cart.res.type";

export const CartService = {
  getCartItems(params: ViewCartRequest) {
    return BaseService.get<ResponseSuccess<CartItem[]>>({
      url: API_PATH.CART.GET_CART,
      payload: params,
    });
  },
  addCartItem(params: AddToCartRequest) {
    return BaseService.post<ResponseSuccess<CartItem>>({
      url: API_PATH.CART.ADD_CART_ITEM,
      payload: params,
    });
  },
  deleteCartItem(params: DeleteCartItemRequest) {
    return BaseService.remove<ResponseSuccess<void>>({
      url: API_PATH.CART.DELETE_CART_ITEM(params.cartItemId),
      payload: params,
    });
  },
};
