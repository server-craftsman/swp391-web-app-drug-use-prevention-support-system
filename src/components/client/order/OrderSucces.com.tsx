import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import { OrderService } from "../../../services/order/order.service";
import type { OrderResponse } from "../../../types/order/Order.res.type";
import { OrderStatus } from "../../../app/enums/orderStatus.enum";

const PAGE_SIZE = 8;

const OrderSuccessList: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);

  let userId = "";
  const userInfoStr = localStorage.getItem("userInfo");
  if (userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr);
      userId = userInfo.id || "";
    } catch {
      userId = "";
    }
  }

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await OrderService.getOrderByUserId({
          pageNumber: current,
          pageSize: PAGE_SIZE,
        });
        const allOrders = res.data?.data || [];
        const filtered = allOrders.filter(
          (order: OrderResponse) => order.orderStatus === OrderStatus.PAID
        );
        setOrders(filtered);
        setTotal(filtered.length);
      } catch {
        message.error("Không thể tải lịch sử đơn hàng!");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId, current]);

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => amount.toLocaleString() + " đ",
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
    },
  ];

  return (
    <Table
      dataSource={orders}
      columns={columns}
      rowKey="orderId"
      loading={loading}
      pagination={{
        current,
        pageSize: PAGE_SIZE,
        total,
        onChange: setCurrent,
      }}
    />
  );
};

export default OrderSuccessList;
