import React from "react";
import { Button } from "antd";
import { useAddCartItem } from "../../hooks/useCart"; // Đường dẫn tùy bạn
import type { AddToCartRequest } from "../../types/cart/Cart.req.type";

interface AddToCartButtonProps {
  courseId: string;
  onAdded?: () => void;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  courseId,
  onAdded,
}) => {
  const { mutate: addToCart, isPending } = useAddCartItem();

  const handleAddToCart = () => {
    const payload: AddToCartRequest = { courseId };

    addToCart(payload, {
      onSuccess: () => {
        if (onAdded) onAdded();
      },
    });
  };

  return (
    <Button
      className="bg-[#20558A]"
      size="large"
      block
      loading={isPending}
      onClick={handleAddToCart}
    >
      🛒 Thêm vào giỏ hàng
    </Button>
  );
};

export default AddToCartButton;
