import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  Select,
  Upload,
  message,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useCreateUser } from "../../../../hooks/useUser";
import { UserRole } from "../../../../app/enums";
import { BaseService } from "../../../../app/api/base.service";
import { LocationService } from "../../../../services/location.service";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";
import type {
  Province,
  District,
  Ward,
} from "../../../../services/location.service";

const { Option } = Select;

const AdminCreateManagerForm: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { mutate: createUser, isPending } = useCreateUser();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [addressDetails, setAddressDetails] = useState<string>("");

  useEffect(() => {
    LocationService.getProvinces().then(setProvinces);
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      LocationService.getDistricts(selectedProvince).then((data) => {
        setDistricts(data);
        setSelectedDistrict("");
        setWards([]);
      });
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      LocationService.getWards(selectedDistrict).then(setWards);
    }
  }, [selectedDistrict]);

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được tải ảnh lên");
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Ảnh phải nhỏ hơn 5MB");
      return false;
    }
    return false;
  };

  const handleFileChange: UploadProps["onChange"] = ({ fileList }) => {
    setFileList(fileList);
    const file = fileList[0];
    if (file?.originFileObj) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      let uploadedUrl = profilePicUrl;
      if (fileList.length > 0 && !profilePicUrl) {
        const file = fileList[0];
        if (file.originFileObj) {
          const url = await BaseService.uploadFile(file.originFileObj);
          if (url) {
            uploadedUrl = url;
            setProfilePicUrl(url);
          } else {
            return;
          }
        }
      }

      const selectedProvObj = provinces.find(
        (p) => p.code === selectedProvince
      );
      const selectedDistObj = districts.find(
        (d) => d.code === selectedDistrict
      );
      const selectedWardObj = wards.find((w) => w.code === values.ward);

      const fullAddress = LocationService.formatFullAddress(
        addressDetails,
        selectedWardObj,
        selectedDistObj,
        selectedProvObj
      );

      const payload = {
        ...values,
        dob: dayjs(values.dob).format("YYYY-MM-DD"),
        profilePicUrl: uploadedUrl || "",
        address: fullAddress,
        role: UserRole.MANAGER,
      };

      createUser(payload, {
        onSuccess: () => {
          form.resetFields();
          setFileList([]);
          setPreviewImage("");
          setProfilePicUrl("");
          if (onSuccess) onSuccess();
        },
      });
    } catch (error) {
      message.error("Tạo người dùng thất bại");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
        Tạo quản lý mới
      </h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        className="space-y-4"
      >
        <Form.Item label="Ảnh đại diện" name="profilePicUrl">
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 mb-2">
              <div className="w-full h-full rounded-full overflow-hidden border shadow">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <UserOutlined className="text-3xl text-gray-400" />
                  </div>
                )}
              </div>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleFileChange}
                maxCount={1}
                fileList={fileList}
              >
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center text-white rounded-full cursor-pointer transition-all">
                  <CameraOutlined className="text-xl" />
                </div>
              </Upload>
            </div>
            {fileList.length > 0 && (
              <div className="text-sm text-gray-500 truncate">
                {fileList[0].name}
              </div>
            )}
          </div>
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="firstName" label="Họ" rules={[{ required: true }]}>
            {" "}
            <Input />{" "}
          </Form.Item>
          <Form.Item name="lastName" label="Tên" rules={[{ required: true }]}>
            {" "}
            <Input />{" "}
          </Form.Item>
        </div>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          {" "}
          <Input prefix={<MailOutlined />} />{" "}
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[{ required: true }]}
        >
          {" "}
          <Input prefix={<PhoneOutlined />} />{" "}
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="dob" label="Ngày sinh" rules={[{ required: true }]}>
            {" "}
            <DatePicker className="w-full" />{" "}
          </Form.Item>
          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true }]}
          >
            {" "}
            <Radio.Group>
              <Radio value="male">Nam</Radio>
              <Radio value="female">Nữ</Radio>
              <Radio value="other">Khác</Radio>
            </Radio.Group>{" "}
          </Form.Item>
        </div>

        <div className="border p-4 rounded bg-gray-50">
          <h3 className="font-medium mb-3">Địa chỉ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="province"
              label="Tỉnh/Thành phố"
              rules={[{ required: true }]}
            >
              {" "}
              <Select onChange={setSelectedProvince} showSearch>
                {provinces.map((p) => (
                  <Option key={p.code} value={p.code}>
                    {p.name}
                  </Option>
                ))}
              </Select>{" "}
            </Form.Item>
            <Form.Item
              name="district"
              label="Quận/Huyện"
              rules={[{ required: true }]}
            >
              {" "}
              <Select
                onChange={setSelectedDistrict}
                disabled={!selectedProvince}
                showSearch
              >
                {districts.map((d) => (
                  <Option key={d.code} value={d.code}>
                    {d.name}
                  </Option>
                ))}
              </Select>{" "}
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="ward"
              label="Phường/Xã"
              rules={[{ required: true }]}
            >
              {" "}
              <Select disabled={!selectedDistrict} showSearch>
                {wards.map((w) => (
                  <Option key={w.code} value={w.code}>
                    {w.name}
                  </Option>
                ))}
              </Select>{" "}
            </Form.Item>
            <Form.Item
              name="addressDetails"
              label="Địa chỉ chi tiết"
              rules={[{ required: true }]}
            >
              {" "}
              <Input
                onChange={(e) => setAddressDetails(e.target.value)}
                prefix={<HomeOutlined />}
              />{" "}
            </Form.Item>
          </div>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
            loading={isPending}
          >
            Tạo quản lý
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminCreateManagerForm;
