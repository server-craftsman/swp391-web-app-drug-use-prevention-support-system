import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, message, Spin } from "antd";
import { useCreateConsultant } from "../../../../hooks/useConsultant";
import { UserService } from "../../../../services/user/user.service";
import type { UserResponse } from "../../../../types/user/User.res.type";
import type { CreateConsultantRequest } from "../../../../types/consultant/consultant.req.type";

const { Option } = Select;

const AdminCreateConsultantForm: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { mutate: createConsultant, isPending } = useCreateConsultant();

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await UserService.getAllUsers({
          pageNumber: 1,
          pageSize: 1000,
        });

        const data = res.data as any;

        if (!Array.isArray(data?.data)) {
          throw new Error("Invalid data format from API");
        }

        // 👉 Lọc user có role KHÁC 'Consultant'
        const filteredUsers = data.data.filter(
          (user: UserResponse) => user.role?.toLowerCase() !== "consultant"
        );

        setUsers(filteredUsers);
      } catch (err) {
        message.error("Không thể tải danh sách người dùng!");
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = (values: any) => {
    const payload: CreateConsultantRequest = {
      userId: values.userId,
      qualifications: values.qualifications
        ?.split(",")
        .map((q: string) => q.trim()),
      jobTitle: values.jobTitle,
      hireDate: new Date().toISOString(), // Lấy thời gian hiện tại
      salary: Number(values.salary),
      status: "Active", // Mặc định là Active
    };

    createConsultant(payload, {
      onSuccess: () => {
        message.success("Tạo chuyên viên tư vấn thành công");
        form.resetFields();
        if (onSuccess) onSuccess();
      },
      onError: () => {
        message.error("Tạo chuyên viên thất bại");
      },
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg  max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
        Tạo chuyên viên tư vấn
      </h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        className="space-y-4"
        initialValues={{
          status: "Active",
        }}
      >
        <Form.Item
          name="userId"
          label="Chọn người dùng"
          rules={[{ required: true, message: "Vui lòng chọn người dùng" }]}
        >
          {loadingUsers ? (
            <Spin />
          ) : (
            <Select
              placeholder="Chọn người dùng"
              showSearch
              optionFilterProp="children"
            >
              {users.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.fullName}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item
          name="qualifications"
          label="Bằng cấp / Chứng chỉ"
          rules={[{ required: true, message: "Vui lòng nhập bằng cấp" }]}
        >
          <Input.TextArea
            placeholder="Nhập bằng cấp, cách nhau bằng dấu phẩy"
            autoSize={{ minRows: 2, maxRows: 5 }}
          />
        </Form.Item>

        <Form.Item
          name="jobTitle"
          label="Chức danh"
          rules={[{ required: true, message: "Vui lòng nhập chức danh" }]}
        >
          <Input />
        </Form.Item>

        {/* Ẩn hireDate, chỉ dùng giá trị thời gian hiện tại trong submit */}
        {/* Nếu muốn hiển thị mà disabled thì có thể để readOnly hoặc disabled */}

        <Form.Item
          name="salary"
          label="Mức lương"
          rules={[{ required: true, message: "Vui lòng nhập mức lương" }]}
        >
          <Input type="number" min={0} addonAfter="VND" />
        </Form.Item>

        {/* Trạng thái cố định, không cho chọn */}
        {/* Có thể dùng hidden input hoặc bỏ hoàn toàn nếu mặc định luôn là Active */}
        <Form.Item name="status" hidden>
          <Input value="Active" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-11 bg-[#20558A] hover:bg-blue-700 text-white font-semibold rounded"
            loading={isPending}
          >
            Tạo chuyên viên tư vấn
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminCreateConsultantForm;
