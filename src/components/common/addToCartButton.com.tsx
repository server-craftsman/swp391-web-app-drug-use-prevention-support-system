import React from "react";
import { ShoppingCartOutlined, LoadingOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useCart } from "../../contexts/Cart.context";

interface AddToCartButtonProps {
  courseId: string;
  onAdded?: () => void;
  variant?: "primary" | "secondary" | "compact";
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  courseId,
  onAdded,
  variant = "primary",
  className = "",
}) => {
  const { addToCart, loading } = useCart();

  const handleAddToCart = async () => {
    await addToCart(courseId);
    if (onAdded) onAdded();
  };

  const getButtonStyles = () => {
    const baseStyles = "font-semibold transition-all duration-300 border-0 flex items-center justify-center gap-2";

    switch (variant) {
      case "primary":
        return `${baseStyles} w-full h-12 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] bg-[#20558A] hover:bg-[#153759] text-white`;
      case "secondary":
        return `${baseStyles} w-full h-10 rounded-lg text-base shadow-md hover:shadow-lg bg-blue-600 hover:bg-blue-700 text-white`;
      case "compact":
        return `${baseStyles} h-8 px-4 rounded-lg text-sm shadow-sm hover:shadow-md bg-[#20558A] hover:bg-[#153759] text-white`;
      default:
        return `${baseStyles} w-full h-12 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] bg-[#20558A] hover:bg-[#153759] text-white`;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: variant === "compact" ? 1.05 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={loading}
        className={`${getButtonStyles()} ${className} ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <LoadingOutlined className="text-lg" />
            </motion.div>
            <span>Đang thêm...</span>
          </>
        ) : (
          <>
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.3 }}
            >
              <ShoppingCartOutlined className="text-lg" />
            </motion.div>
            <span>Thêm vào giỏ hàng</span>
          </>
        )}
      </button>
    </motion.div>
  );
};

export default AddToCartButton;
