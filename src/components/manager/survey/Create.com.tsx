import React from "react";
import { Modal, Form, Input, Select, Tag, Divider } from "antd";
import { SurveyType } from "../../../app/enums/surveyType.enum";
import { SurveyService } from "../../../services/survey/survey.service";
import { helpers } from "../../../utils";
import Editor from "../../common/Editor.com";
import { PlusOutlined, ClockCircleOutlined, FileTextOutlined, BarChartOutlined } from "@ant-design/icons";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const SurveyCreateModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Reset form when modal opens
    React.useEffect(() => {
        if (open) {
            form.resetFields();
        }
    }, [open, form]);

    const getSurveyTypeIcon = (type: SurveyType) => {
        const iconMap = {
            [SurveyType.RISK_ASSESSMENT]: "⚠️",
            [SurveyType.PRE_FEEDBACK]: "🚀",
            [SurveyType.POST_FEEDBACK]: "✅",
        };
        return iconMap[type] || "📊";
    };

    const getSurveyTypeColor = (type: SurveyType) => {
        const colorMap = {
            [SurveyType.RISK_ASSESSMENT]: "orange",
            [SurveyType.PRE_FEEDBACK]: "green",
            [SurveyType.POST_FEEDBACK]: "purple",
        };
        return colorMap[type] || "default";
    };

    const getSurveyTypeDisplayName = (type: SurveyType) => {
        const nameMap = {
            [SurveyType.RISK_ASSESSMENT]: "Đánh giá Rủi ro",
            [SurveyType.PRE_FEEDBACK]: "Phản hồi Trước",
            [SurveyType.POST_FEEDBACK]: "Phản hồi Sau",
        };
        return nameMap[type] || type;
    };
    const handleOk = async () => {
        let payload: any = null;

        try {
            const values = await form.validateFields();

            payload = {
                name: values.name?.trim() || "",
                description: values.description || "",
                surveyType: values.surveyType || SurveyType.RISK_ASSESSMENT,
                estimateTime: Number(values.estimateTime) || 5, // default 5 phút nếu không nhập
            };

            if (!payload.name) {
                helpers.notificationMessage("Tên khảo sát không được để trống", "error");
                return;
            }

            setIsSubmitting(true);

            await SurveyService.createSurvey(payload);

            helpers.notificationMessage("Tạo khảo sát thành công", "success");
            onSuccess();
            onClose();
            form.resetFields();
        } catch (error: any) {
            let errorMessage = "Có lỗi xảy ra khi tạo khảo sát";

            if (error?.response?.status === 500) {
                errorMessage = "Lỗi server 500. Có thể do định dạng dữ liệu không đúng.";
            } else if (error?.response?.status === 400) {
                errorMessage = "Dữ liệu không hợp lệ (400)";
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            helpers.notificationMessage(errorMessage, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <PlusOutlined className="text-white text-lg" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">Tạo khảo sát mới</h2>
                        <p className="text-sm text-gray-500">Thiết lập thông tin cho cuộc khảo sát</p>
                    </div>
                </div>
            }
            open={open}
            onOk={handleOk}
            confirmLoading={isSubmitting}
            onCancel={onClose}
            destroyOnClose
            width={700}
            okText="Tạo khảo sát"
            cancelText="Hủy bỏ"
            okButtonProps={{
                className: "bg-primary hover:bg-primary-dark border-0 shadow-sm hover:shadow-md transition-all duration-200 h-10 px-6 rounded-lg",
                size: "large"
            }}
            cancelButtonProps={{
                className: "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all duration-200 h-10 px-6 rounded-lg",
                size: "large"
            }}
            className="survey-create-modal"
            styles={{
                body: {
                    padding: '24px 32px'
                },
                content: {
                    borderRadius: '16px',
                    background: 'white'
                },
                header: {
                    background: 'white',
                    borderBottom: '1px solid #f0f0f0',
                    padding: '24px 32px 0'
                }
            }}
        >
            <div className="space-y-6">
                {/* Survey Type Preview */}

                <Form form={form} layout="vertical" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="name"
                            label={
                                <span className="font-semibold text-gray-700">
                                    <FileTextOutlined className="mr-2" />
                                    Tên khảo sát
                                </span>
                            }
                            rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập tên khảo sát' }]}
                        >
                            <Input
                                placeholder="Nhập tên khảo sát..."
                                className="h-11 rounded-lg border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-200"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="surveyType"
                            label={
                                <span className="font-semibold text-gray-700">
                                    <BarChartOutlined className="mr-2" />
                                    Loại khảo sát
                                </span>
                            }
                            rules={[{ required: true, message: 'Vui lòng chọn loại khảo sát' }]}
                        >
                            <Select
                                placeholder="Chọn loại khảo sát"
                                optionLabelProp="label"
                                className="h-11 rounded-lg"
                                size="large"
                            >
                                {Object.values(SurveyType).map((t) => (
                                    <Select.Option
                                        key={t}
                                        value={t}
                                        label={
                                            <div className="flex items-center gap-2">
                                                <span>{getSurveyTypeIcon(t)}</span>
                                                <span>{getSurveyTypeDisplayName(t)}</span>
                                            </div>
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            <Tag
                                                color={getSurveyTypeColor(t)}
                                                className="px-2 py-1 rounded-full font-medium border-0"
                                                style={{ margin: 0 }}
                                            >
                                                {getSurveyTypeIcon(t)} {getSurveyTypeDisplayName(t)}
                                            </Tag>
                                        </div>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="estimateTime"
                        label={
                            <span className="font-semibold text-gray-700">
                                <ClockCircleOutlined className="mr-2" />
                                Thời gian ước tính (phút)
                            </span>
                        }
                        rules={[{ required: true, message: 'Vui lòng nhập thời gian ước tính' }]}
                    >
                        <Input
                            type="number"
                            min={1}
                            placeholder="Nhập số phút..."
                            className="h-11 rounded-lg border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-200"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label={
                            <span className="font-semibold text-gray-700">
                                <FileTextOutlined className="mr-2" />
                                Mô tả khảo sát
                            </span>
                        }
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả khảo sát' }]}
                    >
                        <Editor
                            placeholder="Nhập mô tả chi tiết về khảo sát..."
                            height={200}
                        />
                    </Form.Item>
                </Form>

                <Divider />

                {/* Preview Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-3">Xem trước</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>Khảo sát sẽ được tạo với thông tin đã nhập</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Có thể thêm câu hỏi sau khi tạo</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Khảo sát sẽ sẵn sàng để sử dụng</span>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SurveyCreateModal;
