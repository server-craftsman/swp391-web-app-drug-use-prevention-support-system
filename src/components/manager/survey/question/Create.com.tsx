import React from "react";
import { Modal, Form, Select, InputNumber, Divider } from "antd";
import { QuestionType } from "../../../../app/enums/questionType.enum";
import { QuestionService } from "../../../../services/question/question.service";
import type { SurveyResponse } from "../../../../types/survey/Survey.res.type";
import { helpers } from "../../../../utils";
import Editor from "../../../common/Editor.com";
import { PlusOutlined, FileTextOutlined, BarChartOutlined, QuestionCircleOutlined, NumberOutlined } from "@ant-design/icons";

interface Props {
    open: boolean;
    surveys: SurveyResponse[];
    onClose: () => void;
    onSuccess: () => void;
}

const QuestionCreateModal: React.FC<Props> = ({ open, surveys, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Reset form when modal opens
    React.useEffect(() => {
        if (open) {
            form.resetFields();
        }
    }, [open, form]);

    const getQuestionTypeIcon = (type: QuestionType) => {
        const iconMap = {
            [QuestionType.MULTIPLE_CHOICE]: "📝",
        };
        return iconMap[type] || "❓";
    };

    const getQuestionTypeDisplayName = (type: QuestionType) => {
        const nameMap = {
            [QuestionType.MULTIPLE_CHOICE]: "Trắc nghiệm",
        };
        return nameMap[type] || type;
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                surveyId: values.surveyId,
                questionContent: values.questionContent?.trim(),
                questionType: values.questionType || QuestionType.MULTIPLE_CHOICE,
                positionOrder: values.positionOrder || 1,
            };

            if (!payload.surveyId) {
                helpers.notificationMessage("Vui lòng chọn khảo sát", "error");
                return;
            }

            if (!payload.questionContent) {
                helpers.notificationMessage("Nội dung câu hỏi không được để trống", "error");
                return;
            }

            setIsSubmitting(true);
            await QuestionService.createQuestion(payload);

            helpers.notificationMessage("Tạo câu hỏi thành công", "success");
            onSuccess();
            onClose();
            form.resetFields();
        } catch (error: any) {
            console.error("Error creating question:", error);
            let errorMessage = "Có lỗi xảy ra khi tạo câu hỏi";

            if (error?.response?.data?.message) {
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
                        <h2 className="text-xl font-bold text-gray-800 mb-1">Tạo câu hỏi mới</h2>
                        <p className="text-sm text-gray-500">Thêm câu hỏi vào khảo sát</p>
                    </div>
                </div>
            }
            open={open}
            onOk={handleOk}
            confirmLoading={isSubmitting}
            onCancel={onClose}
            destroyOnClose
            width={700}
            okText="Tạo câu hỏi"
            cancelText="Hủy bỏ"
            okButtonProps={{
                className: "bg-primary border-0 shadow-sm hover:shadow-md transition-all duration-200 h-10 px-6 rounded-lg",
                size: "large"
            }}
            cancelButtonProps={{
                className: "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all duration-200 h-10 px-6 rounded-lg",
                size: "large"
            }}
            className="question-create-modal"
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
                <Form form={form} layout="vertical" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="surveyId"
                            label={
                                <span className="font-semibold text-gray-700">
                                    <BarChartOutlined className="mr-2" />
                                    Khảo sát
                                </span>
                            }
                            rules={[{ required: true, message: 'Vui lòng chọn khảo sát' }]}
                        >
                            <Select
                                placeholder="Chọn khảo sát"
                                allowClear
                                className="h-11 rounded-lg"
                                size="large"
                            >
                                {surveys.map((survey) => (
                                    <Select.Option key={survey.id} value={survey.id}>
                                        <div className="flex items-center gap-2">
                                            <span>{survey.name}</span>
                                        </div>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="questionType"
                            label={
                                <span className="font-semibold text-gray-700">
                                    <QuestionCircleOutlined className="mr-2" />
                                    Loại câu hỏi
                                </span>
                            }
                            rules={[{ required: true, message: 'Vui lòng chọn loại câu hỏi' }]}
                            initialValue={QuestionType.MULTIPLE_CHOICE}
                        >
                            <Select
                                placeholder="Chọn loại câu hỏi"
                                className="h-11 rounded-lg"
                                size="large"
                            >
                                {Object.values(QuestionType).map((type) => (
                                    <Select.Option key={type} value={type}>
                                        <div className="flex items-center gap-2">
                                            <span>{getQuestionTypeIcon(type)}</span>
                                            <span>{getQuestionTypeDisplayName(type)}</span>
                                        </div>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="questionContent"
                        label={
                            <span className="font-semibold text-gray-700">
                                <FileTextOutlined className="mr-2" />
                                Nội dung câu hỏi
                            </span>
                        }
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}
                    >
                        <Editor
                            placeholder="Nhập nội dung câu hỏi..."
                            height={200}
                            onChange={(content) => {
                                form.setFieldsValue({ questionContent: content });
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="positionOrder"
                        label={
                            <span className="font-semibold text-gray-700">
                                <NumberOutlined className="mr-2" />
                                Thứ tự
                            </span>
                        }
                        rules={[{ required: true, type: "number", min: 1, message: 'Vui lòng nhập thứ tự hợp lệ' }]}
                        initialValue={1}
                    >
                        <InputNumber
                            min={1}
                            max={1000}
                            placeholder="Nhập thứ tự câu hỏi"
                            className="h-11 rounded-lg w-full"
                            size="large"
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
                            <span>Câu hỏi sẽ được thêm vào khảo sát đã chọn</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Có thể thêm phương án trả lời sau khi tạo</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Câu hỏi sẽ sẵn sàng để sử dụng</span>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default QuestionCreateModal;
