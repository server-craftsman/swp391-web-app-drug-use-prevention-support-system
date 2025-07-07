import { Tabs } from "antd";
import OrderSuccessList from "../../../components/client/order/OrderSucces.com";
import OrderFailList from "../../../components/client/order/OrderFail.com";

export default function OrderHistory() {
  return (
    <Tabs defaultActiveKey="success">
      <Tabs.TabPane tab="Đã Mua" key="success">
        <OrderSuccessList />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Đã Hủy" key="fail">
        <OrderFailList />
      </Tabs.TabPane>
    </Tabs>
  );
}
