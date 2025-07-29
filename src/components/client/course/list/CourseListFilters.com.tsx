import React, { useState, useEffect } from "react";
import { Card, Select, Input, Button, Typography } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { CategoryService } from "../../../../services/category/category.service";
import type { Category } from "../../../../types/category/Category.res.type";
import { TargetAudience } from "../../../../app/enums/targetAudience.enum";

const { Option } = Select;
const { Text } = Typography;

interface CourseListFiltersProps {
  selectedCategory: string;
  targetAudience: string;
  priceSort: string;
  searchTerm: string;
  onApplyFilters: (filters: {
    category: string;
    targetAudience: string;
    priceSort: string;
    searchTerm: string;
  }) => void;
  onClearFilters: () => void;
}

const CourseListFilters: React.FC<CourseListFiltersProps> = ({
  selectedCategory,
  targetAudience,
  priceSort,
  searchTerm,
  onApplyFilters,
  onClearFilters,
}) => {
  // States for categories from API
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  // Temporary filter states (user selections before applying)
  const [tempCategory, setTempCategory] = useState(selectedCategory);
  const [tempTargetAudience, setTempTargetAudience] = useState(targetAudience);
  const [tempPriceSort, setTempPriceSort] = useState(priceSort);
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoryLoading(true);
      try {
        const response = await CategoryService.getAllCategories({
          pageNumber: 1,
          pageSize: 100, // Lấy nhiều để có đủ categories
        });

        if (response.data?.success && Array.isArray(response.data?.data)) {
          const activeCategories = response.data.data.filter(
            (category: Category) => !category.isDelete
          );
          setCategories(activeCategories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Check if there are active applied filters
  const hasActiveFilters =
    (selectedCategory !== "" && selectedCategory !== "all") ||
    (targetAudience !== "" && targetAudience !== "all") ||
    (priceSort !== "" && priceSort !== "default") ||
    searchTerm.trim() !== "";

  // Check if there are pending changes to apply
  const hasPendingChanges =
    tempCategory !== selectedCategory ||
    tempTargetAudience !== targetAudience ||
    tempPriceSort !== priceSort ||
    tempSearchTerm !== searchTerm;

  const handleApplyFilters = () => {
    console.log("Applying filters:", {
      category: tempCategory,
      targetAudience: tempTargetAudience,
      priceSort: tempPriceSort,
      searchTerm: tempSearchTerm,
    });

    onApplyFilters({
      category: tempCategory,
      targetAudience: tempTargetAudience,
      priceSort: tempPriceSort,
      searchTerm: tempSearchTerm,
    });
  };

  const handleClearFilters = () => {
    setTempCategory("");
    setTempTargetAudience("");
    setTempPriceSort("");
    setTempSearchTerm("");
    onClearFilters();
  };

  // Reset temp values when applied filters change
  React.useEffect(() => {
    setTempCategory(selectedCategory);
    setTempTargetAudience(targetAudience);
    setTempPriceSort(priceSort);
    setTempSearchTerm(searchTerm);
  }, [selectedCategory, targetAudience, priceSort, searchTerm]);

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-lg border-0" bodyStyle={{ padding: "24px" }}>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FilterOutlined className="text-blue-600 text-lg" />
            <Text strong className="text-lg text-gray-800">
              Bộ lọc khóa học
            </Text>
            {hasActiveFilters && (
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
            {hasPendingChanges && (
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            )}
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <Input
              size="large"
              placeholder="Tìm kiếm khóa học..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={tempSearchTerm}
              onChange={(e) => setTempSearchTerm(e.target.value)}
              className="rounded-xl border-gray-200 shadow-sm"
              style={{
                borderRadius: "12px",
                fontSize: "16px",
              }}
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* Category Filter */}
          <div>
            <Text strong className="block mb-2 text-gray-700">
              Danh mục
            </Text>
            <Select
              size="large"
              value={tempCategory}
              onChange={setTempCategory}
              style={{ width: "100%" }}
              className="rounded-lg"
              loading={categoryLoading}
              placeholder="Chọn danh mục"
            >
              <Option value="">Tất cả danh mục</Option>
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Target Audience Filter */}
          <div>
            <Text strong className="block mb-2 text-gray-700">
              Đối tượng
            </Text>
            <Select
              size="large"
              value={tempTargetAudience}
              onChange={setTempTargetAudience}
              style={{ width: "100%" }}
              className="rounded-lg"
              placeholder="Chọn đối tượng"
            >
              <Option value="">Tất cả đối tượng</Option>
              <Option value={TargetAudience.STUDENT}>Học sinh</Option>
              <Option value={TargetAudience.TEACHER}>Giáo viên</Option>
              <Option value={TargetAudience.PARENT}>Phụ huynh</Option>
              <Option value={TargetAudience.COMMUNITY}>Cộng đồng</Option>
            </Select>
          </div>

          {/* Price Sort */}
          <div>
            <Text strong className="block mb-2 text-gray-700">
              Sắp xếp giá
            </Text>
            <Select
              size="large"
              value={tempPriceSort}
              onChange={setTempPriceSort}
              style={{ width: "100%" }}
              className="rounded-lg"
              placeholder="Sắp xếp theo"
            >
              <Option value="">Mặc định</Option>
              <Option value="ASC">Giá tăng dần</Option>
              <Option value="DESC">Giá giảm dần</Option>
            </Select>
          </div>

          {/* Apply Filters Button */}
          <div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="primary"
                size="large"
                icon={<CheckOutlined />}
                onClick={handleApplyFilters}
                disabled={!hasPendingChanges}
                className={`w-full h-[42px] rounded-xl font-semibold ${
                  hasPendingChanges
                    ? "bg-blue-600 hover:bg-blue-700 shadow-lg"
                    : "bg-gray-300"
                }`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {hasPendingChanges ? "Áp dụng bộ lọc" : "Đã áp dụng"}
              </Button>
            </motion.div>
          </div>

          {/* Clear Filters Button */}
          <div>
            {hasActiveFilters && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="large"
                  icon={<ClearOutlined />}
                  onClick={handleClearFilters}
                  className="w-full h-[42px] rounded-xl border-gray-300 hover:border-red-400 hover:text-red-500 font-medium"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Filter Status */}
        {hasPendingChanges && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg"
          >
            <Text className="text-orange-700 text-sm font-medium">
              💡 Bạn đã thay đổi bộ lọc. Nhấn "Áp dụng bộ lọc" để xem kết quả.
            </Text>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default CourseListFilters;
