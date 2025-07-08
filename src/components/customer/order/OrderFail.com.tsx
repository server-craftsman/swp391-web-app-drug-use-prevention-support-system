import React, { useEffect, useState } from "react";
import { Table, message, Button, Modal, Spin, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { OrderService } from "../../../services/order/order.service";
import type { OrderResponse } from "../../../types/order/Order.res.type";
import { OrderStatus } from "../../../app/enums/orderStatus.enum";
import CustomSearch from "../../common/CustomSearch.com";

const PAGE_SIZE = 8;

const OrderFailList: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);

  // View modal state
  const [viewModal, setViewModal] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null
  );

  // Search state
  const [search, setSearch] = useState("");

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
        let allOrders = res.data?.data || [];
        allOrders = allOrders.filter(
          (order: OrderResponse) => order.orderStatus === OrderStatus.FAIL
        );
        // Filter by search (mã đơn hàng hoặc ngày đặt)
        let filtered = allOrders;
        if (search) {
          filtered = allOrders.filter(
            (order: OrderResponse) =>
              order.orderId.toLowerCase().includes(search.toLowerCase()) ||
              (order.orderDate &&
                new Date(order.orderDate)
                  .toLocaleDateString("vi-VN")
                  .includes(search))
          );
        }
        setOrders(filtered);
        setTotal(filtered.length);
      } catch {
        message.error("Không thể tải lịch sử đơn hàng!");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    // eslint-disable-next-line
  }, [userId, current, search]);

  // Xem chi tiết đơn hàng
  const handleView = async (orderId: string) => {
    setViewLoading(true);
    setViewModal(true);
    try {
      const res = await OrderService.getOrderById({ orderId });
      if (res.data?.success && res.data?.data) {
        setSelectedOrder(res.data.data);
      } else {
        setSelectedOrder(null);
        message.error("Không tìm thấy đơn hàng!");
      }
    } catch {
      setSelectedOrder(null);
      message.error("Không thể tải chi tiết đơn hàng!");
    } finally {
      setViewLoading(false);
    }
  };

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
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
    },

    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: () => "Đã hủy",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => (
        <div className="flex justify-end">
          {" "}
          {amount?.toLocaleString() + " đ"}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      render: (_: any, record: OrderResponse) => (
        <Tooltip title="Xem chi tiết">
          <Button
            icon={<EyeOutlined />}
            shape="circle"
            size="small"
            onClick={() => handleView(record.orderId)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <CustomSearch
          placeholder="Tìm kiếm theo mã đơn hoặc ngày đặt"
          onSearch={setSearch}
          loading={loading}
          inputWidth="w-64"
        />
      </div>
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
        bordered
        size="middle"
        scroll={{ x: 900 }}
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          padding: 0,
          minWidth: 900,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      />

      <Modal
        open={viewModal}
        title={
          <span style={{ fontSize: 22, fontWeight: 600 }}>
            Thông tin đơn hàng
          </span>
        }
        onCancel={() => setViewModal(false)}
        footer={[
          <Button key="close" onClick={() => setViewModal(false)} size="large">
            Đóng
          </Button>,
        ]}
        width={400}
        style={{ top: 40 }}
        bodyStyle={{
          padding: 32,
          background: "#f5f6fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        centered
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 24,
            minWidth: 260,
            maxWidth: 360,
            margin: "0 auto",
            boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
            fontSize: 16,
            width: "100%",
          }}
        >
          {viewLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 80,
              }}
            >
              <Spin />
            </div>
          ) : selectedOrder ? (
            <>
              <div style={{ marginBottom: 12 }}>
                <b>Mã đơn hàng:</b> {selectedOrder.orderId}
              </div>
              <div style={{ marginBottom: 12 }}>
                <b>Ngày đặt:</b>{" "}
                {selectedOrder.orderDate
                  ? new Date(selectedOrder.orderDate).toLocaleDateString(
                      "vi-VN"
                    )
                  : ""}
              </div>
              <div style={{ marginBottom: 12 }}>
                <b>Tổng tiền:</b> {selectedOrder.totalAmount?.toLocaleString()}{" "}
                đ
              </div>
              <div style={{ marginBottom: 12 }}>
                <b>Trạng thái:</b> Đã hủy
              </div>
            </>
          ) : (
            <div>Không tìm thấy dữ liệu đơn hàng.</div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default OrderFailList;
