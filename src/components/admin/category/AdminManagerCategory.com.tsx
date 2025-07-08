import { useEffect, useState } from "react";
import { CategoryService } from "../../../services/category/category.service";
import type { Category } from "../../../types/category/Category.res.type";
import { Table, Button, Modal, Tooltip, message, Pagination } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import CreateCategoryForm from "./CreateCategoryForm";
import UpdateCategoryForm from "./UpdateCategoryForm";
import DeleteCategory from "./DeleteCategory.com";
import { formatDate } from "../../../utils/helper";
import CustomSearch from "../../common/CustomSearch.com";

const PAGE_SIZE = 8;

const AdminManagerCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Giả sử API hỗ trợ filterByName, pageNumber, pageSize
      const params = {
        filterByName: searchKeyword,
        pageNumber: current,
        pageSize: PAGE_SIZE,
      };
      const res = await CategoryService.getAllCategories(params);
      const data = res.data as any;
      setCategories(Array.isArray(data?.data) ? data.data : []);
      setTotal(data?.totalCount || 0);
    } catch (err) {
      setCategories([]);
      message.error("Lỗi khi lấy danh sách danh mục!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, [current, searchKeyword]);

  const handleCategoryCreated = () => {
    setShowCreateModal(false);
    fetchCategories();
  };

  const handleCategoryUpdated = () => {
    setShowUpdateModal(false);
    fetchCategories();
  };

  const handleViewCategory = async (categoryId: string) => {
    setViewLoading(true);
    setShowViewModal(true);
    try {
      const res = await CategoryService.getCategoryById({ categoryId });
      setViewingCategory(res.data?.data || null);
    } catch {
      setViewingCategory(null);
      message.error("Không thể tải chi tiết danh mục!");
    } finally {
      setViewLoading(false);
    }
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => formatDate(new Date(date)),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Category) => (
        <div className="flex gap-2">
          <Tooltip title="Cập nhật">
            <Button
              icon={<EditOutlined />}
              shape="circle"
              type="default"
              size="small"
              onClick={() => {
                setEditingCategory(record);
                setShowUpdateModal(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              shape="circle"
              type="default"
              size="small"
              onClick={() => handleViewCategory(record.id)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <DeleteCategory
              categoryId={record.id}
              onDeleted={fetchCategories}
              buttonProps={{
                icon: <DeleteOutlined />,
                shape: "circle",
                danger: true,
                size: "small",
                style: { borderColor: "#ff4d4f", color: "#ff4d4f" },
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded shadow relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        {/* Search */}
        <CustomSearch
          onSearch={(keyword) => {
            setCurrent(1);
            setSearchKeyword(keyword);
          }}
          className="mb-0"
          placeholder="Tìm kiếm theo tên danh mục"
          inputWidth="w-80"
        />
        {/* Nút tạo mới */}
        <Button
          type="primary"
          className="bg-[#20558A]"
          icon={<PlusOutlined />}
          onClick={() => setShowCreateModal(true)}
        >
          Tạo danh mục mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={false}
        bordered
      />

      <div className="flex justify-end mt-4">
        <Pagination
          current={current}
          pageSize={PAGE_SIZE}
          total={total}
          onChange={setCurrent}
          showSizeChanger={false}
        />
      </div>

      <Modal
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
        title="Tạo danh mục mới"
        width={500}
      >
        <CreateCategoryForm onSuccess={handleCategoryCreated} />
      </Modal>

      <Modal
        open={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
        footer={null}
        title="Cập nhật danh mục"
        width={500}
      >
        {editingCategory && (
          <UpdateCategoryForm
            category={editingCategory}
            onSuccess={handleCategoryUpdated}
          />
        )}
      </Modal>

      <Modal
        open={showViewModal}
        onCancel={() => setShowViewModal(false)}
        footer={null}
        title="Chi tiết danh mục"
        width={400}
      >
        {viewLoading ? (
          <div>Đang tải...</div>
        ) : viewingCategory ? (
          <div className="space-y-4">
            <div>
              <strong>Tên danh mục:</strong>
              <div>{viewingCategory.name}</div>
            </div>
            <div>
              <strong>Ngày tạo:</strong>
              <div>{formatDate(new Date(viewingCategory.createdAt))}</div>
            </div>
            {/* Thêm các trường khác nếu cần */}
          </div>
        ) : (
          <div>Không tìm thấy danh mục.</div>
        )}
      </Modal>
    </div>
  );
};

export default AdminManagerCategory;
