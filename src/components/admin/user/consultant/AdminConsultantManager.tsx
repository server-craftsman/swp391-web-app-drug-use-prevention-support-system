import { useEffect, useState } from "react";
import { Table, Image, message, Button, Space, Tag, Modal, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { UserService } from "../../../../services/user/user.service";
import { UserRole } from "../../../../app/enums/userRole.enum";
import type { Consultant } from "../../../../types/consultant/consultant.res.type";
import CustomPagination from "../../../common/Pagiation.com";
import CustomSearch from "../../../common/CustomSearch.com"; // ✅ thêm component tìm kiếm
import AdminCreateConsultantForm from "./AdminCreateConsultant";
import AdminDeleteConsultant from "./AdminDeleteConsultant";
import AdminViewConsultant from "./AdminViewConsultant";

const { Option } = Select;

const AdminConsultantManager = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [consultantToDelete, setConsultantToDelete] =
    useState<Consultant | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | undefined>(undefined);
  const [viewConsultantId, setViewConsultantId] = useState<string | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const fetchConsultants = async () => {
    setLoading(true);
    try {
      const res = await UserService.getAllUsers({
        pageNumber: current,
        pageSize,
        role: UserRole.CONSULTANT, // Lọc trực tiếp ở backend
        searchCondition: searchKeyword || undefined,
        isVerified,
      });
      const data = res.data as any;

      if (!Array.isArray(data?.data)) {
        throw new Error("Invalid data format from API");
      }

      setConsultants(data.data);
      setTotal(data.total || data.data.length);
    } catch (err) {
      message.error("Lỗi khi lấy danh sách tư vấn viên!");
      setConsultants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultants();
    // eslint-disable-next-line
  }, [current, pageSize, searchKeyword, isVerified]);

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleView = (record: Consultant) => {
    setViewConsultantId(record.id);
    setViewModalOpen(true);
  };

  const handleDelete = (record: Consultant) => {
    setConsultantToDelete(record);
  };

  const columns: ColumnsType<Consultant> = [
    {
      title: "Ảnh đại diện",
      dataIndex: "profilePicUrl",
      key: "profilePicUrl",
      width: 80,
      render: (url: string) =>
        url ? (
          <Image
            src={url}
            alt="avatar"
            width={50}
            height={50}
            style={{ borderRadius: "50%" }}
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-xs">No img</span>
          </div>
        ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string) => (
        <span className="font-medium text-gray-900">{text}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => <span className="text-blue-600">{text}</span>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => {
        const g = (gender || "").toLowerCase();
        if (g === "male" || g === "nam") {
          return <Tag color="blue">Nam</Tag>;
        }
        if (g === "female" || g === "nữ") {
          return <Tag color="pink">Nữ</Tag>;
        }
        return <Tag color="default">Khác</Tag>;
      },
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: () => <Tag color="purple">Tư vấn viên</Tag>,
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record: Consultant) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
            title="Xem chi tiết"
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record)}
            title="Xoá"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Quản lý Tư vấn viên
          </h2>
          <p className="text-gray-600 mt-1">
            Quản lý đội ngũ tư vấn viên hệ thống
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          className="bg-[#20558A]"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Thêm tư vấn viên mới
        </Button>
      </div>

      {/* Thanh tìm kiếm và filter */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <CustomSearch
          onSearch={(keyword) => {
            setCurrent(1);
            setSearchKeyword(keyword);
          }}
          placeholder="Tìm kiếm tư vấn viên theo tên, email, số điện thoại"
          inputWidth="w-96"
        />
        <Select
          allowClear
          placeholder="Lọc trạng thái xác thực"
          style={{ width: 200 }}
          value={isVerified}
          onChange={(value) => {
            setCurrent(1);
            setIsVerified(value);
          }}
        >
          <Option value={true}>Đã xác thực</Option>
          <Option value={false}>Chưa xác thực</Option>
        </Select>
      </div>

      <div className="mb-4">
        <Tag color="purple">Tổng cộng: {total} tư vấn viên</Tag>
      </div>

      <Table
        columns={columns}
        dataSource={consultants}
        rowKey="id"
        loading={loading}
        pagination={false}
        bordered
        className="mb-4"
      />

      <CustomPagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={handlePageChange}
      />

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <AdminCreateConsultantForm
          onSuccess={() => {
            setIsModalOpen(false);
            fetchConsultants();
          }}
        />
      </Modal>

      {/* Modal xoá tư vấn viên */}
      <AdminDeleteConsultant
        open={!!consultantToDelete}
        onClose={() => setConsultantToDelete(null)}
        consultant={consultantToDelete}
        onDeleted={() => {
          setConsultantToDelete(null);
          fetchConsultants();
        }}
      />
      {viewConsultantId && (
        <AdminViewConsultant
          userId={viewConsultantId} // Sửa lại prop này cho đúng
          open={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setViewConsultantId(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminConsultantManager;
