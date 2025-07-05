import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Divider, Button, Typography, Spin } from "antd";
import { formatCurrency } from "../../../utils/helper";
import { motion } from "framer-motion";
import { OrderService } from "../../../services/order/order.service";
import type { OrderResponse } from "../../../types/order/Order.res.type";
import { useCreatePayment } from "../../../hooks/usePayment";
import { useUpdateOrderStatus } from "../../../hooks/useOrder";
import { PaymentMethod } from "../../../app/enums/paymentMethod.enum";
import OrderDetailsList from "./OrderList.com";
import OrderInfo from "./OderInfo.com";
import { OrderStatus } from "../../../app/enums/orderStatus.enum";

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const createPaymentMutation = useCreatePayment();
  const updateOrderStatusMutation = useUpdateOrderStatus();

  useEffect(() => {
    if (orderId) {
      OrderService.getOrderById({ orderId })
        .then((res) => {
          if (res?.data?.data) {
            setOrder(res.data.data);
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
        paymentMethod: PaymentMethod.CASH,
      },
      {
        onSuccess: () => {
          navigate("/payment-result", { state: { isSuccess: true } });
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
        navigate("/payment-result", { state: { isCancelled: true } });
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
        <Button type="primary" onClick={() => navigate("/courses")}>
          Quay lại trang khóa học
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-blue-100"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Typography.Title
        level={2}
        className="text-center text-[#20558A] mb-6 font-bold"
        style={{ letterSpacing: 1 }}
      >
        Xác nhận thanh toán
      </Typography.Title>
      <Divider />
      <OrderInfo order={order} />

      <Divider />
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
          Xác nhận đã thanh toán
        </Button>
      </div>
    </motion.div>
  );
};

export default PaymentPage;
