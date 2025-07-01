import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { Program } from "../../../types/program/Program.type";
import { ProgramService } from "../../../services/program/program.service";
import dayjs from "dayjs";
import { BaseService } from "../../../app/api/base.service";
import { ProgramType } from "../../../app/enums/programType.enum";
import { helpers } from "../../../utils";
import Editor from "../../common/Editor.com";
import LocationPicker from "../../common/LocationPicker";

interface CreateProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

const { Option } = Select;

const CreateProgramModal: React.FC<CreateProps> = ({ visible, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);
    const [imgUrl, setImgUrl] = useState<string>("");

    const handleUpload = async (file: File) => {
        try {
            setUploading(true);
            const url = await BaseService.uploadFile(file);
            setImgUrl(url || "");
        } catch (err) {
            helpers.notificationMessage("Upload ảnh thất bại", 'error')
        } finally {
            setUploading(false);
        }
    };

    const beforeUpload = (file: File) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            helpers.notificationMessage("Chỉ được upload file ảnh", 'error')
            return Upload.LIST_IGNORE;
        }
        handleUpload(file);
        return false; // prevent auto upload
    };

    const handleFinish = async (values: any) => {
        const payload = {
            ...values,
            startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
            endDate: dayjs(values.endDate).format("YYYY-MM-DD"),
            programImgUrl: imgUrl,
        } as Program;

        try {
            await ProgramService.createProgram(payload as any);
            helpers.notificationMessage("Chương trình đã được tạo thành công", 'success')
            onSuccess();
            form.resetFields();
        } catch (error) {
            helpers.notificationMessage("Tạo chương trình thất bại", 'error')
        }
    };

    return (
        <Modal
            title="Thêm chương trình"
            open={visible}
            width={680}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
            style={{
                position: 'fixed',
                right: 0,
                top: 0,
                height: '100vh',
                margin: 0
            }}
            styles={{
                body: { height: 'calc(100vh - 55px)', overflowY: 'auto' },
                content: { height: '100vh', borderRadius: 0 }
            }}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item name="name" label="Tên chương trình" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
                    <Editor placeholder="Nhập mô tả chương trình..." height={150} />
                </Form.Item>

                <Form.Item name="location" label="Địa điểm" rules={[{ required: true }]}>
                    <LocationPicker placeholder="Chọn địa điểm từ bản đồ..." />
                </Form.Item>

                <Form.Item name="type" label="Loại chương trình" rules={[{ required: true }]}>
                    <Select placeholder="Chọn loại chương trình">
                        <Option value={ProgramType.COMMUNICATION}>Communication</Option>
                        <Option value={ProgramType.TRAINING}>Training</Option>
                        <Option value={ProgramType.COUNSELING}>Counseling</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true }]}>
                    <DatePicker className="w-full" format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true }]}>
                    <DatePicker className="w-full" format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item label="Ảnh chương trình" valuePropName="fileList">
                    <Upload beforeUpload={beforeUpload} showUploadList={false}>
                        <Button icon={<UploadOutlined />} loading={uploading}>
                            Tải lên ảnh
                        </Button>
                    </Upload>
                    {imgUrl && <img src={imgUrl} alt="preview" className="mt-2 w-28 h-20 object-cover" />}
                </Form.Item>

                <div className="flex justify-end">
                    <Button onClick={onCancel} className="mr-2">
                        Hủy
                    </Button>
                    <Button type="primary" htmlType="submit" style={{ backgroundColor: "#20558A" }}>
                        Tạo
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default CreateProgramModal;
