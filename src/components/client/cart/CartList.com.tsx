// ViewCartPage.tsx
import React, { useEffect } from "react";
import { Typography, Empty, Divider, Button, Spin } from "antd";
import {
  ShoppingOutlined,
  CreditCardOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../../utils/helper";
import { helpers } from "../../../utils";
import { useCart } from "../../../contexts/Cart.context";
import CartCard from "./CartCard.com";
import { ROUTER_URL } from "../../../consts/router.path.const";
import DeleteCartItem from "./DeleteCartItem.com";
import { useCreateOrder } from "../../../hooks/useOrder";

const { Title } = Typography;

const ViewCartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    loading,
    removeFromCart,
    totalPrice,
    selectedIds,
    setSelectedIds,
    fetchCartItems, // lấy từ context
  } = useCart();

  // Fetch lại data mỗi khi truy cập trang
  useEffect(() => {
    fetchCartItems();
    // eslint-disable-next-line
  }, []);

  const createOrderMutation = useCreateOrder();

  const handleSelect = (cartId: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, cartId] : prev.filter((id) => id !== cartId)
    );
  };

  const isChecked = (cartId: string) => selectedIds.includes(cartId);

  const handleCreateOrder = () => {
    if (selectedIds.length === 0) {
      return helpers.notificationMessage(
        "Vui lòng chọn ít nhất một sản phẩm để thanh toán",
        "warning"
      );
    }

    createOrderMutation.mutate(
      { selectedCartItemIds: selectedIds },
      {
        onSuccess: (res) => {
          if (res?.data?.data.orderId) {
            navigate("/payment", {
              state: { orderId: res.data.data.orderId },
            });
          } else {
            helpers.notificationMessage(
              "Tạo đơn hàng thất bại. Vui lòng thử lại.",
              "error"
            );
          }
        },
        onError: () => {
          helpers.notificationMessage(
            "Đã xảy ra lỗi khi tạo đơn hàng.",
            "error"
          );
        },
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(ROUTER_URL.CLIENT.COURSE)}
                className="flex items-center text-gray-600 hover:text-primary transition-colors"
              >
                <ArrowLeftOutlined className="mr-2" />
                <span className="hidden sm:inline">Tiếp tục mua sắm</span>
              </motion.button>
              <div className="h-6 w-px bg-gray-300 hidden sm:block" />
              <div className="flex items-center space-x-2">
                <ShoppingOutlined className="text-2xl text-primary" />
                <Title level={2} className="!mb-0 !text-gray-800">
                  Giỏ hàng của bạn
                </Title>
                {cartItems.length > 0 && (
                  <span className="bg-primary text-white px-2 py-1 rounded-full text-sm">
                    {cartItems.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <div className="bg-white rounded-2xl p-12 shadow-sm">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingOutlined className="text-4xl text-gray-400" />
                </div>
                <Empty
                  description={
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-600">
                        Giỏ hàng trống
                      </p>
                      <p className="text-gray-500">
                        Hãy khám phá các khóa học tuyệt vời của chúng tôi
                      </p>
                    </div>
                  }
                  image={null}
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8"
                >
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate("/courses")}
                    className="bg-primary hover:bg-secondary border-0 rounded-xl px-8 h-12"
                  >
                    Khám phá khóa học
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b bg-gray-50">
                    <Title level={5} className="!mb-0">
                      Danh sách giỏ hàng ({cartItems.length})
                    </Title>
                  </div>

                  <div className="divide-y divide-gray-100">
                    <AnimatePresence>
                      {cartItems.map((item, index) => (
                        <motion.div
                          key={item.cartId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <CartCard
                            item={item}
                            checked={isChecked(item.cartId)}
                            onSelect={(checked) =>
                              handleSelect(item.cartId, checked)
                            }
                            onDelete={
                              <DeleteCartItem
                                cartItemId={item.cartId}
                                onDeleted={() => removeFromCart(item.cartId)}
                                buttonProps={{
                                  size: "small",
                                  type: "text",
                                }}
                              />
                            }
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="sticky top-6"
                >
                  <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Tóm tắt đơn hàng
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-gray-600">
                        <span>Tổng số khóa học:</span>
                        <span className="font-medium">{cartItems.length}</span>
                      </div>

                      <Divider className="my-4" />

                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-800">
                          Tổng cộng:
                        </span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {formatCurrency(totalPrice)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="primary"
                          size="large"
                          disabled={cartItems.length === 0}
                          icon={<CreditCardOutlined />}
                          onClick={handleCreateOrder}
                          className="w-full h-12 bg-primary hover:bg-secondary border-0 rounded-xl font-semibold text-base"
                        >
                          Thanh toán ngay
                        </Button>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          size="large"
                          onClick={() => navigate("/courses")}
                          className="w-full h-12 border-gray-300 rounded-xl font-medium text-base"
                        >
                          Tiếp tục mua sắm
                        </Button>
                      </motion.div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      <div className="text-sm font-medium text-gray-700">
                        Bảo đảm an toàn:
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div>✓ Thanh toán an toàn 100%</div>
                        <div>✓ Hoàn tiền trong 30 ngày</div>
                        <div>✓ Truy cập trọn đời</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ViewCartPage;
