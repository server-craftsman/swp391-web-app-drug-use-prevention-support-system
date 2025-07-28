import React, { useState, useEffect } from "react";
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

interface UpdateProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    programId?: string | null;
}

const { Option } = Select;

const riskLabels: Record<RiskLevel, string> = {
    [RiskLevel.NONE]: "Không",
    [RiskLevel.LOW]: "Thấp",
    [RiskLevel.MEDIUM]: "Trung bình",
    [RiskLevel.HIGH]: "Cao",
    [RiskLevel.VERY_HIGH]: "Rất cao",
};

const UpdateProgramModal: React.FC<UpdateProps> = ({ visible, onCancel, onSuccess, programId }) => {
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);
    const [imgUrl, setImgUrl] = useState<string>("");
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [vidUrl, setVidUrl] = useState<string>("");
    const [uploadingVideo, setUploadingVideo] = useState(false);

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
                            riskLevel: program.riskLevel,
                            programVidUrl: program.programVidUrl,
                        };

                        console.log("Setting form values:", formValues);
                        form.setFieldsValue(formValues);
                        setImgUrl(program.programImgUrl ?? "");
                        setVidUrl(program.programVidUrl ?? "");
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
            setVidUrl("");
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

    const handleVideoUpload = async (file: File) => {
        try {
            setUploadingVideo(true);
            const url = await BaseService.uploadFile(file);
            setVidUrl(url || "");
        } catch {
            helpers.notificationMessage("Upload video thất bại", 'error');
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

    const handleFinish = async (values: any) => {
        if (!programId) return;
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
            await ProgramService.updateProgram(programId.toString(), payload as any);
            helpers.notificationMessage("Chương trình đã được cập nhật thành công", 'success')
            onSuccess();
        } catch {
            helpers.notificationMessage("Cập nhật chương trình thất bại", 'error')
        }
    };

    const validateProgram = (values: any): string | null => {
        if (!values.riskLevel) {
            return "Vui lòng chọn mức độ rủi ro";
        }
        if (values.programVidUrl && !/^https?:\/\/.+/.test(values.programVidUrl)) {
            return "Đường dẫn video không hợp lệ";
        }
        if (values.startDate && values.endDate && (dayjs(values.startDate).isSame(values.endDate, 'day') || dayjs(values.startDate).isAfter(values.endDate))) {
            return "Ngày bắt đầu phải nhỏ hơn ngày kết thúc";
        }
        return null;
    };

    const disablePastDate = (current: any) => current && current < dayjs().startOf('day');

    const disabledEndDate = (current: any) => {
        const start = form.getFieldValue('startDate');
        if (!start) return disablePastDate(current);
        return current && (current < dayjs().startOf('day') || current.isSame(start, 'day') || current.isBefore(start, 'day'));
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">Cập nhật chương trình</h2>
                        <p className="text-sm text-gray-500">Chỉnh sửa thông tin chương trình</p>
                    </div>
                </div>
            }
            open={visible}
            width={720}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
            confirmLoading={loadingDetail}
            styles={{
                body: {
                    padding: '24px 32px'
                },
                content: {
                    borderRadius: '12px',
                    background: 'white'
                },
                header: {
                    background: 'white',
                    borderBottom: 'none',
                    padding: '24px 32px 0'
                }
            }}
            className="update-program-modal"
        >
            {loadingDetail ? (
                <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải chi tiết chương trình...</p>
                    </div>
                </div>
            ) : (
                <Form form={form} layout="vertical" onFinish={handleFinish} className="space-y-6" key={programId}>
                    <div className="grid grid-cols-1 gap-6">
                        <Form.Item
                            name="name"
                            label={<span className="text-sm font-semibold text-gray-700">Tên chương trình</span>}
                            rules={[{ required: true, message: "Vui lòng nhập tên chương trình" }]}
                        >
                            <Input
                                placeholder="Nhập tên chương trình..."
                                className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:shadow-lg transition-all duration-200"
                                prefix={
                                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                    </svg>
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label={<span className="text-sm font-semibold text-gray-700">Mô tả chương trình</span>}
                            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                        >
                            <div className="rounded-xl border-2 border-gray-200 focus-within:border-blue-500 transition-colors duration-200">
                                <Editor
                                    placeholder="Mô tả chi tiết về chương trình, mục tiêu và nội dung..."
                                    height={180}
                                    onChange={(value) => {
                                        form.setFieldsValue({ description: value });
                                        form.validateFields(['description']);
                                    }}
                                />
                            </div>
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                name="location"
                                label={<span className="text-sm font-semibold text-gray-700">Địa điểm tổ chức</span>}
                                rules={[{ required: true, message: "Vui lòng chọn địa điểm" }]}
                            >
                                <LocationPicker
                                    placeholder="Chọn địa điểm từ bản đồ..."
                                />
                            </Form.Item>

                            <Form.Item
                                name="type"
                                label={<span className="text-sm font-semibold text-gray-700">Loại chương trình</span>}
                                rules={[{ required: true, message: "Vui lòng chọn loại chương trình" }]}
                            >
                                <Select
                                    placeholder="Chọn loại chương trình"
                                    className="h-12"
                                    style={{ height: '48px' }}
                                    suffixIcon={
                                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    }
                                >
                                    <Option value={ProgramType.COMMUNICATION}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            Giao lưu
                                        </div>
                                    </Option>
                                    <Option value={ProgramType.TRAINING}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            Đào tạo
                                        </div>
                                    </Option>
                                    <Option value={ProgramType.COUNSELING}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                            Tư vấn
                                        </div>
                                    </Option>
                                </Select>
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                name="startDate"
                                label={<span className="text-sm font-semibold text-gray-700">Ngày bắt đầu</span>}
                                rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
                            >
                                <DatePicker
                                    className="w-full h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:shadow-lg transition-all duration-200"
                                    format="DD/MM/YYYY"
                                    disabledDate={disablePastDate}
                                    placeholder="Chọn ngày bắt đầu"
                                    suffixIcon={
                                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                    }
                                />
                            </Form.Item>

                            <Form.Item
                                name="endDate"
                                label={<span className="text-sm font-semibold text-gray-700">Ngày kết thúc</span>}
                                rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
                            >
                                <DatePicker
                                    className="w-full h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:shadow-lg transition-all duration-200"
                                    format="DD/MM/YYYY"
                                    disabledDate={disabledEndDate}
                                    placeholder="Chọn ngày kết thúc"
                                    suffixIcon={
                                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                    }
                                />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="riskLevel"
                            label={<span className="text-sm font-semibold text-gray-700">Mức độ rủi ro</span>}
                            rules={[{ required: true, message: "Vui lòng chọn mức độ rủi ro" }]}
                        >
                            <Select
                                placeholder="Đánh giá mức độ rủi ro của chương trình"
                                className="h-12"
                                style={{ height: '48px' }}
                                suffixIcon={
                                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                }
                            >
                                {Object.entries(riskLabels).map(([value, label]) => (
                                    <Option key={value} value={value}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${value === RiskLevel.LOW ? 'bg-green-500' :
                                                value === RiskLevel.MEDIUM ? 'bg-yellow-500'
                                                    : value === RiskLevel.HIGH ? 'bg-red-500'
                                                        : value === RiskLevel.VERY_HIGH ? 'bg-red-700'
                                                            : 'bg-gray-500'
                                                }`}></div>
                                            {label}
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                label={<span className="text-sm font-semibold text-gray-700">Video giới thiệu</span>}
                                className="mb-0"
                            >
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-blue-400 transition-colors duration-200">
                                    <Upload beforeUpload={beforeUploadVideo} showUploadList={false} accept="video/*">
                                        <div className="text-center">
                                            <Button
                                                icon={<VideoCameraAddOutlined />}
                                                loading={uploadingVideo}
                                                className="h-10 px-6 rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                                                size="large"
                                            >
                                                {uploadingVideo ? 'Đang tải lên...' : 'Tải lên video'}
                                            </Button>
                                            <p className="text-xs text-gray-500 mt-2">Hỗ trợ MP4, AVI, MOV</p>
                                        </div>
                                    </Upload>
                                    {vidUrl && (
                                        <div className="mt-4">
                                            <video
                                                controls
                                                className="w-full h-32 object-cover rounded-lg shadow-md"
                                                playsInline
                                                crossOrigin="anonymous"
                                            >
                                                <source src={vidUrl} />
                                            </video>
                                        </div>
                                    )}
                                </div>
                            </Form.Item>

                            <Form.Item
                                label={<span className="text-sm font-semibold text-gray-700">Ảnh đại diện</span>}
                                className="mb-0"
                            >
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-blue-400 transition-colors duration-200">
                                    <Upload beforeUpload={beforeUpload} showUploadList={false} accept="image/*">
                                        <div className="text-center">
                                            <Button
                                                icon={<UploadOutlined />}
                                                loading={uploading}
                                                className="h-10 px-6 rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                                                size="large"
                                            >
                                                {uploading ? 'Đang tải lên...' : 'Tải lên ảnh'}
                                            </Button>
                                            <p className="text-xs text-gray-500 mt-2">JPG, PNG, GIF tối đa 5MB</p>
                                        </div>
                                    </Upload>
                                    {imgUrl && (
                                        <div className="mt-4">
                                            <img
                                                src={imgUrl}
                                                alt="preview"
                                                className="w-full h-32 object-cover rounded-lg shadow-md"
                                            />
                                        </div>
                                    )}
                                </div>
                            </Form.Item>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                        <Button
                            onClick={onCancel}
                            className="h-12 px-8 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                            size="large"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="h-12 px-8 rounded-xl bg-primary border-0 hover:bg-primary/80 shadow-lg hover:shadow-xl transition-all duration-200"
                            size="large"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Cập nhật chương trình
                            </span>
                        </Button>
                    </div>
                </Form>
            )}
        </Modal>
    );
};

export default UpdateProgramModal;
