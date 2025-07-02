// components/cart/DeleteCartItem.tsx
import React from "react";
import { Button, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { CartService } from "../../../services/cart/cart.service"; // Đường dẫn có thể khác
import type { DeleteCartItemRequest } from "../../../types/cart/Cart.req.type";

interface DeleteCartItemProps {
  cartItemId: string;
  onDeleted?: () => void;
  buttonProps?: React.ComponentProps<typeof Button>;
}

const DeleteCartItem: React.FC<DeleteCartItemProps> = ({
  cartItemId,
  onDeleted,
  buttonProps,
}) => {
  const handleDelete = async () => {
    try {
      const params: DeleteCartItemRequest = { cartItemId };
      await CartService.deleteCartItem(params);
      message.success("Xóa sản phẩm khỏi giỏ hàng thành công!");
      onDeleted?.();
    } catch (error) {
      console.error("DeleteCartItem error:", error);
      message.error("Xóa thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <Popconfirm
      title="Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng không?"
      onConfirm={handleDelete}
      okText="Xóa"
      cancelText="Hủy"
    >
      <Button danger icon={<DeleteOutlined />} {...buttonProps}>
        Xóa
      </Button>
    </Popconfirm>
  );
};

export default DeleteCartItem;
