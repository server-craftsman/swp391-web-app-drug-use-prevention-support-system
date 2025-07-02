import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Divider, Button, Typography, Tag, Spin } from "antd";
import { formatCurrency } from "../../../utils/helper";
import { motion } from "framer-motion";
import { OrderService } from "../../../services/order/order.service";
import type { OrderResponse } from "../../../types/order/Order.res.type";
import { useCreatePayment } from "../../../hooks/usePayment";
import { PaymentMethod } from "../../../app/enums/paymentMethod.enum";

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const createPaymentMutation = useCreatePayment(); // ✅ sử dụng hook

  useEffect(() => {
    if (orderId) {
      OrderService.getOrderById({ orderId })
        .then((res) => {
          if (res?.data?.data) {
            setOrder(res.data.data);
          }
        })
        .catch((err) => {
          console.error("Lỗi lấy đơn hàng:", err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const handleConfirmPayment = () => {
    if (!order) return;

    createPaymentMutation.mutate({
      orderId: order.orderId,
      userId: order.userId,
      amount: order.totalAmount,
      paymentMethod: PaymentMethod.CASH, // hoặc "momo", "credit_card" tùy theo hệ thống của bạn
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center mt-10">
        <Typography.Title level={3}>Không tìm thấy đơn hàng</Typography.Title>
        <Button type="primary" onClick={() => navigate("/courses")}>
          Quay lại trang khóa học
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto mt-6 p-4 bg-white rounded-2xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Typography.Title level={2}>Thông tin thanh toán</Typography.Title>
      <Divider />

      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-gray-700">
          <span>Mã đơn hàng:</span>
          <span className="font-medium">{order.orderId}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Ngày đặt:</span>
          <span>{new Date(order.orderDate).toLocaleString("vi-VN")}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Khách hàng:</span>
          <span>{order.userName}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Trạng thái đơn hàng:</span>
          <Tag
            color={
              order.orderStatus?.toLowerCase() === "pending"
                ? "orange"
                : "green"
            }
          >
            {order.orderStatus || "Đang xử lý"}
          </Tag>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Trạng thái thanh toán:</span>
          <Tag
            color={
              order.paymentStatus?.toLowerCase() === "unpaid" ? "red" : "green"
            }
          >
            {order.paymentStatus || "unpaid"}
          </Tag>
        </div>
      </div>

      <Divider />
      <Typography.Title level={4}>Danh sách khóa học</Typography.Title>

      {order.orderDetails?.length ? (
        <div className="space-y-4">
          {order.orderDetails.map((item) => (
            <Card
              key={item.orderDetailId}
              className="border border-gray-200 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <Typography.Text strong>{item.courseName}</Typography.Text>
                <div className="text-right text-primary font-semibold">
                  {formatCurrency(item.amount)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Typography.Text type="secondary">
          Không có khóa học nào trong đơn hàng này.
        </Typography.Text>
      )}

      <Divider />

      <div className="flex justify-between items-center text-lg font-semibold">
        <span>Tổng thanh toán:</span>
        <span className="text-green-600">
          {formatCurrency(order.totalAmount || 0)}
        </span>
      </div>

      <Button
        type="primary"
        block
        size="large"
        loading={createPaymentMutation.isPending}
        className="mt-6"
        onClick={handleConfirmPayment}
      >
        Xác nhận đã thanh toán
      </Button>
    </motion.div>
  );
};

export default PaymentPage;
