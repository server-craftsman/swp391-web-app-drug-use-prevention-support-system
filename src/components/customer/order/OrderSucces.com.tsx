import React, { useEffect, useState } from "react";
import { Table, message, Button, Modal, Spin, Tooltip, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { OrderService } from "../../../services/order/order.service";
import type { OrderResponse } from "../../../types/order/Order.res.type";
import { OrderStatus } from "../../../app/enums/orderStatus.enum";
import CustomSearch from "../../common/CustomSearch.com";

const PAGE_SIZE = 8;

const OrderSuccessList: React.FC = () => {
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

  // Lấy userId từ localStorage (chỉ dùng để fetch, không render ra UI)
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
          (order: OrderResponse) => order.orderStatus === OrderStatus.PAID
        );
        // Filter by search (theo tên khóa học hoặc ngày đặt)
        let filtered = allOrders;
        if (search) {
          filtered = allOrders.filter(
            (order: OrderResponse) =>
              order.orderDetails?.some((d) =>
                d.courseName?.toLowerCase().includes(search.toLowerCase())
              ) ||
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
    // KHÔNG hiển thị orderId

    {
      title: "Khóa học",
      dataIndex: "orderDetails",
      key: "orderDetails",
      render: (details: any[]) =>
        details && details.length > 0 ? (
          details.map((d) => (
            <Tag key={d.courseId} color="blue">
              {d.courseName}
            </Tag>
          ))
        ) : (
          <span>Không có</span>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: () => <Tag color="green">Đã mua</Tag>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => (
        <div className="flex justify-end">
          {amount?.toLocaleString("vi-VN") + " đ"}
        </div>
      ),
    },
    {
      title: "Ngày mua",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date: string) => (
        <div className="flex justify-end">
          {date ? new Date(date).toLocaleDateString("vi-VN") : ""}
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
          placeholder="Tìm kiếm theo tên khóa học hoặc ngày đặt"
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
        width={420}
        style={{ top: 40 }}
        bodyStyle={{
          padding: 32,
          background: "#fff", // Đổi về trắng cho đồng nhất
          borderRadius: 12,
        }}
        centered
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
          <div style={{ fontSize: 16 }}>
            {/* KHÔNG hiển thị orderId */}
            <div style={{ marginBottom: 10 }}>
              <b>Ngày đặt:</b>{" "}
              {selectedOrder.orderDate
                ? new Date(selectedOrder.orderDate).toLocaleDateString("vi-VN")
                : ""}
            </div>
            <div style={{ marginBottom: 10 }}>
              <b>Người mua:</b> {selectedOrder.userName || "Bạn"}
            </div>
            <div style={{ marginBottom: 10 }}>
              <b>Khóa học đã mua:</b>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {selectedOrder.orderDetails?.map((d) => (
                  <li key={d.courseId}>
                    {d.courseName}{" "}
                    <span style={{ color: "#888", fontSize: 13 }}>
                      ({d.amount?.toLocaleString("vi-VN")} đ)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginBottom: 10 }}>
              <b>Tổng tiền:</b>{" "}
              {selectedOrder.totalAmount?.toLocaleString("vi-VN")} đ
            </div>
            <div>
              <b>Thanh toán:</b>{" "}
              <Tag
                color={
                  selectedOrder.paymentStatus === "Success" ? "green" : "red"
                }
              >
                {selectedOrder.paymentStatus === "Success"
                  ? "Thành công"
                  : selectedOrder.paymentStatus}
              </Tag>
            </div>
          </div>
        ) : (
          <div>Không tìm thấy dữ liệu đơn hàng.</div>
        )}
      </Modal>
    </>
  );
};

export default OrderSuccessList;
