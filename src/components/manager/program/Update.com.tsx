import React, { useState, useEffect } from "react";
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

interface UpdateProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    programId?: string | null;
}

const { Option } = Select;

const UpdateProgramModal: React.FC<UpdateProps> = ({ visible, onCancel, onSuccess, programId }) => {
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);
    const [imgUrl, setImgUrl] = useState<string>("");
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => {
        if (visible && programId) {
            const fetchDetail = async () => {
                try {
                    setLoadingDetail(true);
                    const res = await ProgramService.getProgramById(programId);
                    console.log("Program detail response", res);
                    if (res?.data) {
                        const raw: any = res.data;
                        const candidate: Program = raw.data ?? raw; // unwrap if needed
                        const { success, message, ...program } = candidate as any; // strip extra fields

                        // Clear form first
                        form.resetFields();

                        // Set form values with proper formatting
                        const formValues = {
                            name: program.name,
                            description: program.description,
                            location: program.location,
                            type: program.type,
                            startDate: program.startDate ? dayjs(program.startDate) : undefined,
                            endDate: program.endDate ? dayjs(program.endDate) : undefined,
                        };

                        console.log("Setting form values:", formValues);
                        form.setFieldsValue(formValues);
                        setImgUrl(program.programImgUrl ?? "");
                    }
                } catch (err) {
                    console.error("Fetch detail error", err);
                } finally {
                    setLoadingDetail(false);
                }
            };
            fetchDetail();
        } else if (!visible) {
            // Reset form when modal is closed
            form.resetFields();
            setImgUrl("");
        }
    }, [visible, programId, form]);

    const handleUpload = async (file: File) => {
        try {
            setUploading(true);
            const url = await BaseService.uploadFile(file);
            setImgUrl(url || "");
        } catch {
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
        return false;
    };

    const handleFinish = async (values: any) => {
        if (!programId) return;
        const payload = {
            ...values,
            startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
            endDate: dayjs(values.endDate).format("YYYY-MM-DD"),
            programImgUrl: imgUrl,
        } as Program;

        try {
            await ProgramService.updateProgram(programId.toString(), payload as any);
            helpers.notificationMessage("Chương trình đã được cập nhật thành công", 'success')
            onSuccess();
        } catch {
            helpers.notificationMessage("Cập nhật chương trình thất bại", 'error')
        }
    };

    return (
        <Modal
            title="Cập nhật chương trình"
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
            confirmLoading={loadingDetail}
            width={680}
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
            {loadingDetail ? (
                <div className="flex justify-center py-8">
                    <div>Đang tải chi tiết chương trình...</div>
                </div>
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    key={programId}
                >
                    <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
                        <Editor placeholder="Nhập mô tả chương trình..." height={150} />
                    </Form.Item>
                    <Form.Item name="location" label="Địa điểm" rules={[{ required: true }]}>
                        <LocationPicker placeholder="Chọn địa điểm từ bản đồ..." />
                    </Form.Item>
                    <Form.Item name="type" label="Loại chương trình" rules={[{ required: true }]}>
                        <Select>
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
                            <Button icon={<UploadOutlined />} loading={uploading}> Upload Ảnh </Button>
                        </Upload>
                        {imgUrl && <img src={imgUrl} alt="preview" className="mt-2 w-28 h-20 object-cover" />}
                    </Form.Item>

                    <div className="flex justify-end">
                        <Button onClick={onCancel} className="mr-2">Hủy</Button>
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: "#20558A" }}>Cập nhật</Button>
                    </div>
                </Form>
            )}
        </Modal>
    );
};

export default UpdateProgramModal;
