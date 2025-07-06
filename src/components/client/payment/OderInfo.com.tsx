// pages/client/payment/components/OrderInfo.tsx
import React from "react";
import { Tag } from "antd";
import type { OrderResponse } from "../../../types/order/Order.res.type";
import {
  UserOutlined,
  CalendarOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";

interface OrderInfoProps {
  order: OrderResponse;
}

const OrderInfo: React.FC<OrderInfoProps> = ({ order }) => {
  return (
    <div className="mb-4 space-y-3">
      <div className="flex justify-between text-gray-700">
        <span>Mã đơn hàng:</span>
        <span className="font-semibold tracking-wide">{order.orderId}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>
          <UserOutlined className="mr-1" />
          Khách hàng:
        </span>
        <span>{order.userName}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>
          <CalendarOutlined className="mr-1" />
          Ngày đặt:
        </span>
        <span>{new Date(order.orderDate).toLocaleString("vi-VN")}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>
          <CreditCardOutlined className="mr-1" />
          Phương thức thanh toán:
        </span>
        <span className="font-medium text-blue-700">Tiền Mặt</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Trạng thái đơn hàng:</span>
        <Tag
          color={
            order.orderStatus?.toLowerCase() === "pending"
              ? "orange"
              : order.orderStatus?.toLowerCase() === "fail"
              ? "red"
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
  );
};

export default OrderInfo;
