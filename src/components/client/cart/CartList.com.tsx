// src/components/client/cart/CartList.com.tsx

import React, { useEffect, useState } from "react";
import { Typography, Empty, Divider, List, Button, Spin } from "antd";
import { formatCurrency } from "../../../utils/helper";
import type { CartItem } from "../../../types/cart/Cart.res.type";
import { CartService } from "../../../services/cart/cart.service";
import CartCard from "./CartCard.com";

const { Title, Text } = Typography;

const ViewCartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const storedUserInfo = localStorage.getItem("userInfo");
        if (!storedUserInfo) return;

        const userInfo = JSON.parse(storedUserInfo);
        const userId = userInfo?.id;
        if (!userId) return;

        const response = await CartService.getCartItems({ userId });
        if (response?.data?.success && Array.isArray(response.data.data)) {
          setCartItems(response.data.data);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Lỗi lấy giỏ hàng:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleSelect = (cartId: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, cartId] : prev.filter((id) => id !== cartId)
    );
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    return selectedIds.includes(item.cartId)
      ? acc + item.price * (1 - item.discount)
      : acc;
  }, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin tip="Đang tải giỏ hàng..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Title level={2}>🛒 Giỏ hàng của bạn</Title>

      {cartItems.length === 0 ? (
        <Empty description="Không có khóa học nào trong giỏ hàng" />
      ) : (
        <>
          <List
            dataSource={cartItems}
            renderItem={(item) => (
              <CartCard
                item={item}
                checked={selectedIds.includes(item.cartId)}
                onSelect={(checked) => handleSelect(item.cartId, checked)}
                onDelete={() => {
                  // TODO: gọi API xóa nếu cần
                  console.log("Xóa cartId:", item.cartId);
                }}
              />
            )}
          />

          <Divider />

          <div className="flex justify-between items-center">
            <Title level={4}>Tổng cộng:</Title>
            <Text strong className="text-xl text-primary">
              {formatCurrency(totalPrice)}
            </Text>
          </div>

          <div className="flex justify-end mt-4 gap-2">
            <Button type="default">Tiếp tục mua sắm</Button>
            <Button type="primary" disabled={selectedIds.length === 0}>
              Thanh toán {selectedIds.length > 0 && `(${selectedIds.length})`}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewCartPage;
