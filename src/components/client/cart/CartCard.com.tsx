import React from "react";
import { Card, Checkbox, Image, Typography, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { formatCurrency } from "../../../utils/helper";
import type { CartItem } from "../../../types/cart/Cart.res.type";

const { Text } = Typography;

interface CartCardProps {
  item: CartItem;
  checked: boolean;
  onSelect: (checked: boolean) => void;
  onDelete: () => void;
}

const CartCard: React.FC<CartCardProps> = ({
  item,
  checked,
  onSelect,
  onDelete,
}) => {
  return (
    <Card
      bodyStyle={{ padding: 12 }}
      style={{
        marginBottom: 12,
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Checkbox & Image */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Checkbox
            checked={checked}
            onChange={(e) => onSelect(e.target.checked)}
          />
          <Image
            src={item.courseImageUrl}
            alt={item.courseName}
            width={64}
            height={64}
            preview={false}
            style={{ borderRadius: 6, objectFit: "cover" }}
          />
        </div>

        {/* Course Info */}
        <div className="flex-1 overflow-hidden">
          <div className="text-base font-semibold truncate">
            {item.courseName}
          </div>
          <div className="flex items-center gap-2 mt-1">
            {item.discount > 0 && (
              <Text type="secondary" delete>
                {formatCurrency(item.price)}
              </Text>
            )}
            <Text strong type="warning">
              {formatCurrency(item.price * (1 - item.discount))}
            </Text>
          </div>
        </div>

        {/* Xóa */}
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={onDelete}
        />
      </div>
    </Card>
  );
};

export default CartCard;
