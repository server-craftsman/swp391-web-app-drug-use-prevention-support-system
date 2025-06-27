import React from "react";
import { Checkbox, Image, Typography, Button, Tag } from "antd";
import { DeleteOutlined, BookOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-6 hover:bg-gray-50 transition-colors duration-200"
    >
      <div className="flex items-start space-x-4">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-1">
          <Checkbox
            checked={checked}
            onChange={(e) => onSelect(e.target.checked)}
            className="scale-110"
          />
        </div>

        {/* Course Image */}
        <div className="flex-shrink-0">
          <div className="relative group">
            <Image
              src={item.courseImageUrl}
              alt={item.courseName}
              width={120}
              height={80}
              preview={false}
              className="rounded-xl object-cover shadow-sm"
              style={{ aspectRatio: '3/2' }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-xl" />
          </div>
        </div>

        {/* Course Info */}
        <div className="flex-1 min-w-0">
          <div className="space-y-3">
            {/* Course Title & Status */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 leading-snug">
                  {item.courseName}
                </h3>
                <div className="flex items-center space-x-2 mt-2">
                  <Tag
                    color={item.status === 'Pending' ? 'orange' : item.status === 'Completed' ? 'green' : 'red'}
                    className="text-xs"
                  >
                    {item.status === 'Pending' ? 'Chờ xử lý' :
                      item.status === 'Completed' ? 'Hoàn thành' : 'Đã hủy'}
                  </Tag>
                  <div className="flex items-center text-gray-500 text-sm">
                    <BookOutlined className="mr-1" />
                    <span>Khóa học trực tuyến</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                {item.discount > 0 ? (
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(item.price * (1 - item.discount))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Text type="secondary" delete className="text-base">
                        {formatCurrency(item.price)}
                      </Text>
                      <div className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                        -{Math.round(item.discount * 100)}%
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(item.price)}
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  Truy cập trọn đời
                </div>
              </div>

              {/* Delete Button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={onDelete}
                  className="!w-10 !h-10 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200"
                  title="Xóa khỏi giỏ hàng"
                />
              </motion.div>
            </div>

            {/* Course Features */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                  <span>📱 Học trên mọi thiết bị</span>
                </div>
                <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                  <span>🎓 Chứng chí hoàn thành</span>
                </div>
                <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                  <span>💬 Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartCard;
