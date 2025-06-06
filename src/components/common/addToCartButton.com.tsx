import React from "react";
import { Button, message } from "antd";

interface AddToCartButtonProps {
  onAdded?: () => void; // callback nếu cần
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ onAdded }) => {
  const handleAddToCart = () => {
    message.success("Đã thêm vào giỏ hàng!");
    if (onAdded) {
      onAdded();
    }
    // Có thể thêm logic lưu vào localStorage hoặc state tại đây nếu cần
  };

  return (
    <Button
      className="bg-[#20558A]"
      size="large"
      block
      onClick={handleAddToCart}
    >
      🛒 Thêm vào giỏ hàng
    </Button>
  );
};

export default AddToCartButton;
