import React from "react";
import { Card, Typography } from "antd";
import { formatCurrency } from "../../../utils/helper";
import type { OrderResponse } from "../../../types/order/Order.res.type";
import { BookOutlined } from "@ant-design/icons";

interface Props {
  orderDetails: OrderResponse["orderDetails"];
}

const OrderDetailsList: React.FC<Props> = ({ orderDetails }) => {
  if (!orderDetails?.length) {
    return (
      <Typography.Text type="secondary">
        Không có khóa học nào trong đơn hàng này.
      </Typography.Text>
    );
  }

  return (
    <div className="space-y-4">
      {orderDetails.map((item) => (
        <Card
          key={item.orderDetailId}
          className="border border-blue-100 shadow-md rounded-xl"
          bodyStyle={{ padding: "18px 20px" }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOutlined className="text-blue-500" />
              <Typography.Text strong className="text-lg">
                {item.courseName}
              </Typography.Text>
            </div>
            <div className="text-right text-green-600 font-bold text-lg">
              {formatCurrency(item.amount)}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default OrderDetailsList;
