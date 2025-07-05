import { useState, useEffect } from "react";
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
  LockOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useCreateUser } from "../../../../hooks/useUser";
import { UserRole } from "../../../../app/enums";
import { BaseService } from "../../../../app/api/base.service";
import { LocationService } from "../../../../services/location.service";
import type {
  Province,
  District,
  Ward,
} from "../../../../services/location.service";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";

const { Option } = Select;

const AdminCreateStaffForm = ({ onSuccess }: { onSuccess?: () => void }) => {
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
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isImage) message.error("Chỉ chọn file ảnh!");
    if (!isLt5M) message.error("Ảnh phải nhỏ hơn 5MB!");
    return isImage && isLt5M ? false : Upload.LIST_IGNORE;
  };

  const handleFileChange: UploadProps["onChange"] = ({ fileList }) => {
    setFileList(fileList);
    const file = fileList[0];
    if (file?.originFileObj) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file.originFileObj);
    } else if (file?.thumbUrl) {
      setPreviewImage(file.thumbUrl);
    } else {
      setPreviewImage("");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      let finalProfilePicUrl = profilePicUrl;
      if (fileList.length > 0 && !profilePicUrl) {
        const file = fileList[0].originFileObj;
        if (file) {
          const url = await BaseService.uploadFile(file);
          if (url) {
            finalProfilePicUrl = url;
            setProfilePicUrl(url);
          } else return;
        }
      }

      const fullAddress = LocationService.formatFullAddress(
        addressDetails,
        wards.find((w) => w.code === values.ward),
        districts.find((d) => d.code === selectedDistrict),
        provinces.find((p) => p.code === selectedProvince)
      );

      const { confirmPassword, ...rest } = values;

      const payload = {
        ...rest,
        address: fullAddress,
        dob: dayjs(values.dob).format("YYYY-MM-DD"),
        profilePicUrl: finalProfilePicUrl,
        role: UserRole.STAFF,
      };

      createUser(payload, {
        onSuccess: () => {
          message.success("Tạo nhân viên thành công");
          form.resetFields();
          setFileList([]);
          setPreviewImage("");
          if (onSuccess) onSuccess();
        },
        onError: () => {
          message.error("Tạo nhân viên thất bại");
        },
      });
    } catch (err) {
      message.error("Lỗi hệ thống");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto mt-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Tạo Nhân Viên Mới
      </h2>

      <Form.Item name="profilePicUrl" label="Ảnh đại diện">
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28 mb-2 group">
            <div className="w-full h-full border-4 rounded-full overflow-hidden border-blue-300">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="avatar"
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
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full cursor-pointer">
                <CameraOutlined className="text-white text-xl" />
              </div>
            </Upload>
          </div>
        </div>
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="firstName"
          label="Họ"
          rules={[{ required: true, message: "Nhập họ" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Tên"
          rules={[{ required: true, message: "Nhập tên" }]}
        >
          <Input />
        </Form.Item>
      </div>

      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true }, { type: "email" }]}
      >
        <Input prefix={<MailOutlined />} />
      </Form.Item>

      <Form.Item
        name="phoneNumber"
        label="Số điện thoại"
        rules={[{ required: true }]}
      >
        <Input prefix={<PhoneOutlined />} />
      </Form.Item>

      <Form.Item
        name="password"
        label="Mật khẩu"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
      >
        <Input.Password prefix={<LockOutlined />} />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Xác nhận mật khẩu"
        dependencies={["password"]}
        hasFeedback
        rules={[
          { required: true, message: "Vui lòng xác nhận mật khẩu" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined />} />
      </Form.Item>

      <Form.Item name="dob" label="Ngày sinh" rules={[{ required: true }]}>
        <DatePicker className="w-full" />
      </Form.Item>

      <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
        <Radio.Group>
          <Radio value="male">Nam</Radio>
          <Radio value="female">Nữ</Radio>
          <Radio value="other">Khác</Radio>
        </Radio.Group>
      </Form.Item>

      <div className="border rounded p-4 bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">Địa chỉ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="province"
            label="Tỉnh/TP"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Chọn tỉnh"
              onChange={setSelectedProvince}
              showSearch
            >
              {provinces.map((p) => (
                <Option key={p.code} value={p.code}>
                  {p.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="district"
            label="Quận/Huyện"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Chọn huyện"
              onChange={setSelectedDistrict}
              disabled={!selectedProvince}
              showSearch
            >
              {districts.map((d) => (
                <Option key={d.code} value={d.code}>
                  {d.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="ward" label="Phường/Xã" rules={[{ required: true }]}>
            <Select
              placeholder="Chọn phường"
              disabled={!selectedDistrict}
              showSearch
            >
              {wards.map((w) => (
                <Option key={w.code} value={w.code}>
                  {w.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="addressDetails"
            label="Địa chỉ chi tiết"
            rules={[{ required: true }]}
          >
            <Input
              prefix={<HomeOutlined />}
              onChange={(e) => setAddressDetails(e.target.value)}
            />
          </Form.Item>
        </div>
      </div>

      <Form.Item className="mt-4">
        <Button
          type="primary"
          htmlType="submit"
          loading={isPending}
          className="w-full h-11 font-semibold"
        >
          Tạo nhân viên
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AdminCreateStaffForm;
