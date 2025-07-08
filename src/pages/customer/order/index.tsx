import { Tabs } from "antd";
import OrderSuccessList from "../../../components/customer/order/OrderSucces.com";
import OrderFailList from "../../../components/customer/order/OrderFail.com";

export default function OrderHistory() {
  return (
    <>
      <h2 style={{ fontSize: 28, fontWeight: 700 }}>Lịch sử đơn hàng</h2>
      <Tabs defaultActiveKey="success">
        <Tabs.TabPane tab="Đã Mua" key="success">
          <OrderSuccessList />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Đã Hủy" key="fail">
          <OrderFailList />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
}
