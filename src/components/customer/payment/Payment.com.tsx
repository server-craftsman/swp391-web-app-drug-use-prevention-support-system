import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Divider, Button, Typography, Spin, Select, Card, Avatar } from "antd";
import { formatCurrency } from "../../../utils/helper";
import { motion } from "framer-motion";
import { OrderService } from "../../../services/order/order.service";
import type { OrderResponse } from "../../../types/order/Order.res.type";
import { useCreatePayment } from "../../../hooks/usePayment";
import { useUpdateOrderStatus } from "../../../hooks/useOrder";
import { PaymentMethod } from "../../../app/enums/paymentMethod.enum";
import OrderDetailsList from "./OrderList.com";
import { OrderStatus } from "../../../app/enums/orderStatus.enum";
import {
  CreditCardOutlined,
  DollarCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ROUTER_URL } from "../../../consts/router.path.const";
import { UserService } from "../../../services/user/user.service";
import type { UserResponse } from "../../../types/user/User.res.type";

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH
  );
  const [buyer, setBuyer] = useState<UserResponse | null>(null);

  const createPaymentMutation = useCreatePayment();
  const updateOrderStatusMutation = useUpdateOrderStatus();

  useEffect(() => {
    if (orderId) {
      OrderService.getOrderById({ orderId })
        .then(async (res) => {
          if (res?.data?.data) {
            setOrder(res.data.data);
            // Lấy userId từ order và gọi API lấy thông tin user
            if (res.data.data.userId) {
              try {
                const userRes = await UserService.getUserById({
                  userId: res.data.data.userId,
                });
                if (userRes?.data?.data) {
                  setBuyer(userRes.data.data);
                }
              } catch {
                setBuyer(null);
              }
            }
          }
        })
        .catch((err) => {
          console.error("❌ Lỗi lấy đơn hàng:", err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const handleConfirmPayment = () => {
    if (!order) return;

    createPaymentMutation.mutate(
      {
        orderId: order.orderId,
        userId: order.userId,
        amount: order.totalAmount,
        paymentMethod: paymentMethod,
      },
      {
        onSuccess: (res) => {
          // Nếu là chuyển khoản và có payUrl thì redirect sang trang ngân hàng
          if (
            paymentMethod === PaymentMethod.CREDIT_CARD &&
            res?.data?.data?.payUrl
          ) {
            window.location.href = res.data.data.payUrl;
          } else {
            // Tiền mặt hoặc không có payUrl thì về trang kết quả
            navigate(ROUTER_URL.CLIENT.PAYMENT_SUCCESS);
          }
        },
        onError: () => {
          navigate(ROUTER_URL.CLIENT.PAYMENT_FAIL);
        },
      }
    );
  };

  const handleCancelPayment = () => {
    if (!order) return;

    const payload = {
      orderId: order.orderId,
      newStatus: OrderStatus.FAIL,
    };

    updateOrderStatusMutation.mutate(payload, {
      onSuccess: () => {
        navigate(ROUTER_URL.CLIENT.PAYMENT_FAIL);
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center mt-10">
        <Typography.Title level={3}>Không tìm thấy đơn hàng</Typography.Title>
        <Button type="primary" onClick={() => navigate(ROUTER_URL.CLIENT.COURSE)}>
          Quay lại trang khóa học
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto mt-10 p-4 sm:p-8 bg-white rounded-2xl shadow-2xl border border-blue-100 mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Typography.Title
        level={2}
        className="text-center text-[#20558A] mb-8 font-bold"
        style={{ letterSpacing: 1 }}
      >
        Xác nhận thanh toán
      </Typography.Title>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Bên trái: Thông tin người mua */}
        <Card
          className="flex-1"
          style={{
            minWidth: 350,
            maxWidth: 450,
            borderRadius: 16,
            boxShadow: "0 2px 12px 0 rgba(32,85,138,0.08)",
          }}
        >
          <div className="flex flex-col items-center">
            <Avatar
              size={72}
              src={buyer?.profilePicUrl}
              icon={<UserOutlined />}
              style={{
                backgroundColor: "#e6f0fa",
                color: "#20558A",
                marginBottom: 12,
                fontSize: 36,
              }}
            >
              {buyer?.fullName ? (
                buyer.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              ) : (
                <UserOutlined />
              )}
            </Avatar>
            <Typography.Title level={4} style={{ marginBottom: 0 }}>
              {buyer?.fullName || "Người mua"}
            </Typography.Title>
            <Typography.Text type="secondary">
              {buyer?.email || "Chưa có email"}
            </Typography.Text>
            <Divider />
            <div className="w-full">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-600">
                  Số điện thoại:
                </span>
                <span>{buyer?.phoneNumber || "Chưa có"}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-600">Mã đơn hàng:</span>
                <span>{order.orderId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-600">Ngày mua:</span>
                <span>
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleDateString("vi-VN")
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Bên phải: Thông tin đơn hàng */}
        <div className="flex-1">
          <Card
            className="w-full"
            style={{
              borderRadius: 16,
              boxShadow: "0 2px 12px 0 rgba(32,85,138,0.08)",
            }}
            bodyStyle={{ padding: 24 }}
          >
            <Typography.Title level={4} className="mb-2 text-[#20558A]">
              Danh sách khóa học
            </Typography.Title>
            <OrderDetailsList orderDetails={order.orderDetails} />

            <Divider />
            <div className="flex justify-between items-center text-lg font-semibold mb-4">
              <span>Tổng thanh toán:</span>
              <span className="text-green-600 text-2xl">
                {formatCurrency(order.totalAmount || 0)}
              </span>
            </div>

            <div className="mb-6">
              <Select
                value={paymentMethod}
                onChange={setPaymentMethod}
                style={{ width: "100%" }}
                size="large"
                options={[
                  {
                    value: PaymentMethod.CASH,
                    label: (
                      <span>
                        <DollarCircleOutlined className="mr-2 text-green-600" />
                        Tiền mặt
                      </span>
                    ),
                  },
                  {
                    value: PaymentMethod.CREDIT_CARD,
                    label: (
                      <span>
                        <CreditCardOutlined className="mr-2 text-blue-600" />
                        Chuyển khoản ngân hàng
                      </span>
                    ),
                  },
                ]}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                danger
                block
                size="large"
                loading={updateOrderStatusMutation.isPending}
                onClick={handleCancelPayment}
                className="font-semibold"
              >
                Huỷ thanh toán
              </Button>
              <Button
                type="primary"
                block
                size="large"
                loading={createPaymentMutation.isPending}
                onClick={handleConfirmPayment}
                className="bg-gradient-to-r from-[#20558A] to-blue-500 font-semibold"
              >
                Thanh toán
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentPage;
