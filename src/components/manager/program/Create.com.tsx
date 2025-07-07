import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Upload, Button } from "antd";
import { UploadOutlined, VideoCameraAddOutlined } from "@ant-design/icons";
import type { Program } from "../../../types/program/Program.type";
import { ProgramService } from "../../../services/program/program.service";
import dayjs from "dayjs";
import { BaseService } from "../../../app/api/base.service";
import { ProgramType } from "../../../app/enums/programType.enum";
import { helpers } from "../../../utils";
import Editor from "../../common/Editor.com";
import LocationPicker from "../../common/LocationPicker";
import { RiskLevel } from "../../../app/enums/riskLevel.enum";

interface CreateProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

const { Option } = Select;

const riskLabels: Record<RiskLevel, string> = {
    [RiskLevel.NONE]: "Không",
    [RiskLevel.LOW]: "Thấp",
    [RiskLevel.MEDIUM]: "Trung bình",
    [RiskLevel.HIGH]: "Cao",
    [RiskLevel.VERY_HIGH]: "Rất cao",
};

const CreateProgramModal: React.FC<CreateProps> = ({ visible, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);
    const [imgUrl, setImgUrl] = useState<string>("");
    const [vidUrl, setVidUrl] = useState<string>("");
    const [uploadingVideo, setUploadingVideo] = useState(false);

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

    const handleVideoUpload = async (file: File) => {
        try {
            setUploadingVideo(true);
            const url = await BaseService.uploadFile(file);
            setVidUrl(url || "");
        } catch (err) {
            helpers.notificationMessage("Upload video thất bại", 'error')
        } finally {
            setUploadingVideo(false);
        }
    };

    const beforeUploadVideo = (file: File) => {
        const isVideo = file.type.startsWith("video/");
        if (!isVideo) {
            helpers.notificationMessage("Chỉ được upload file video", 'error');
            return Upload.LIST_IGNORE;
        }
        handleVideoUpload(file);
        return false;
    };

    const disablePastDate = (current: any) => current && current < dayjs().startOf('day');

    const disabledEndDate = (current: any) => {
        const start = form.getFieldValue('startDate');
        if (!start) return disablePastDate(current);
        return current && (current < dayjs().startOf('day') || current.isSame(start, 'day') || current.isBefore(start, 'day'));
    };

    const validateProgram = (values: any): string | null => {
        if (!values.riskLevel) {
            return "Vui lòng chọn mức độ rủi ro";
        }
        if (values.programVidUrl && !/^https?:\/\/.+/.test(values.programVidUrl)) {
            return "Đường dẫn video không hợp lệ";
        }
        if (values.startDate && values.endDate && (dayjs(values.startDate).isSame(dayjs(values.endDate), 'day') || dayjs(values.startDate).isAfter(dayjs(values.endDate)))) {
            return "Ngày bắt đầu phải nhỏ hơn ngày kết thúc";
        }
        return null;
    };

    const handleFinish = async (values: any) => {
        const errorMsg = validateProgram(values);
        if (errorMsg) {
            helpers.notificationMessage(errorMsg, 'error');
            return;
        }
        const payload = {
            ...values,
            startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
            endDate: dayjs(values.endDate).format("YYYY-MM-DD"),
            programImgUrl: imgUrl,
            programVidUrl: vidUrl,
        } as Program;

        try {
            await ProgramService.createProgram(payload as any);
            helpers.notificationMessage("Chương trình đã được tạo thành công", 'success');
            onSuccess();
            form.resetFields();
            setImgUrl("");
            setVidUrl("");
        } catch (error) {
            helpers.notificationMessage("Tạo chương trình thất bại", 'error');
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
                    <DatePicker className="w-full" format="DD/MM/YYYY" disabledDate={disablePastDate} />
                </Form.Item>

                <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true }]}>
                    <DatePicker className="w-full" format="DD/MM/YYYY" disabledDate={disabledEndDate} />
                </Form.Item>

                <Form.Item name="riskLevel" label="Mức độ rủi ro" rules={[{ required: true, message: "Vui lòng chọn mức độ rủi ro" }]}>
                    <Select placeholder="Chọn mức độ rủi ro">
                        {Object.entries(riskLabels).map(([value, label]) => (
                            <Option key={value} value={value}>{label}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Video giới thiệu" valuePropName="fileList">
                    <Upload beforeUpload={beforeUploadVideo} showUploadList={false} accept="video/*">
                        <Button icon={<VideoCameraAddOutlined />} loading={uploadingVideo}> Tải lên video </Button>
                    </Upload>
                    {vidUrl && (
                        <video src={vidUrl} controls className="mt-2 w-40 h-28 object-cover" />
                    )}
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
