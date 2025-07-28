import React from "react";
import { Modal, Form, Select, InputNumber, Divider } from "antd";
import { QuestionType } from "../../../../app/enums/questionType.enum";
import { QuestionService } from "../../../../services/question/question.service";
import type { QuestionResponse } from "../../../../types/question/Question.res.type";
import type { SurveyResponse } from "../../../../types/survey/Survey.res.type";
import { helpers } from "../../../../utils";
import Editor from "../../../common/Editor.com";
import { EditOutlined, FileTextOutlined, BarChartOutlined, QuestionCircleOutlined, NumberOutlined, SaveOutlined } from "@ant-design/icons";

interface Props {
    open: boolean;
    initialData: QuestionResponse | null;
    surveys: SurveyResponse[];
    onClose: () => void;
    onSuccess: () => void;
}

const QuestionUpdateModal: React.FC<Props> = ({ open, initialData, surveys, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = React.useState(false);
    const [editorValue, setEditorValue] = React.useState("");

    /* Populate form when initialData changes */
    React.useEffect(() => {
        if (open && initialData) {
            // Ensure we have the survey data before setting form values
            const surveyExists = surveys.find(s => s.id === initialData.surveyId);

            form.setFieldsValue({
                surveyId: initialData.surveyId,
                questionContent: initialData.questionContent,
                questionType: initialData.questionType,
                positionOrder: initialData.positionOrder,
            });

            // Set editor value
            setEditorValue(initialData.questionContent || "");

            // Debug logging
            console.log("Update modal - initialData:", initialData);
            console.log("Update modal - surveys:", surveys);
            console.log("Update modal - survey exists:", surveyExists);
        } else if (!open) {
            form.resetFields();
            setEditorValue("");
        }
    }, [open, initialData, surveys, form]);

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
            if (!initialData?.id) return;

            const payload = {
                questionContent: values.questionContent?.trim(),
                questionType: values.questionType || QuestionType.MULTIPLE_CHOICE,
                positionOrder: values.positionOrder || 1,
            };

            if (!payload.questionContent) {
                helpers.notificationMessage("Nội dung câu hỏi không được để trống", "error");
                return;
            }

            setSubmitting(true);
            await QuestionService.updateQuestion(initialData.id, payload);

            helpers.notificationMessage("Cập nhật câu hỏi thành công", "success");
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error updating question:", error);
            let errorMessage = "Có lỗi xảy ra khi cập nhật câu hỏi";

            if (error?.response?.status === 404) {
                errorMessage = "Câu hỏi không tồn tại hoặc đã bị xóa.";
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            helpers.notificationMessage(errorMessage, "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditorChange = (content: string) => {
        setEditorValue(content);
        form.setFieldsValue({ questionContent: content });
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                        <EditOutlined className="text-white text-lg" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">Cập nhật câu hỏi</h2>
                        <p className="text-sm text-gray-500">Chỉnh sửa thông tin câu hỏi</p>
                    </div>
                </div>
            }
            open={open}
            onOk={handleOk}
            confirmLoading={submitting}
            onCancel={onClose}
            destroyOnClose
            width={700}
            okText="Lưu thay đổi"
            cancelText="Hủy bỏ"
            okButtonProps={{
                className: "bg-green-500 hover:bg-green-600 border-0 shadow-sm hover:shadow-md transition-all duration-200 h-10 px-6 rounded-lg",
                size: "large",
                icon: <SaveOutlined />
            }}
            cancelButtonProps={{
                className: "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-all duration-200 h-10 px-6 rounded-lg",
                size: "large"
            }}
            className="question-update-modal"
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
            {initialData && surveys.length > 0 ? (
                <div className="space-y-6">

                    <Form form={form} layout="vertical" className="space-y-4" key={initialData.id}>
                        <Form.Item
                            name="surveyId"
                            label={
                                <span className="font-semibold text-gray-700">
                                    <BarChartOutlined className="mr-2" />
                                    Khảo sát
                                </span>
                            }
                        >
                            <Select
                                placeholder="Chọn khảo sát"
                                disabled
                                value={initialData.surveyId}
                                showSearch
                                optionFilterProp="children"
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
                            <div className="text-sm text-gray-500 mt-1">
                                Không thể thay đổi khảo sát khi cập nhật câu hỏi
                            </div>
                        </Form.Item>

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
                                value={editorValue}
                                placeholder="Nhập nội dung câu hỏi..."
                                height={200}
                                onChange={handleEditorChange}
                            />
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                name="questionType"
                                label={
                                    <span className="font-semibold text-gray-700">
                                        <QuestionCircleOutlined className="mr-2" />
                                        Loại câu hỏi
                                    </span>
                                }
                                rules={[{ required: true, message: 'Vui lòng chọn loại câu hỏi' }]}
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

                            <Form.Item
                                name="positionOrder"
                                label={
                                    <span className="font-semibold text-gray-700">
                                        <NumberOutlined className="mr-2" />
                                        Thứ tự
                                    </span>
                                }
                                rules={[{ required: true, type: "number", min: 1, message: 'Vui lòng nhập thứ tự hợp lệ' }]}
                            >
                                <InputNumber
                                    min={1}
                                    max={1000}
                                    placeholder="Nhập thứ tự câu hỏi"
                                    className="h-11 rounded-lg w-full"
                                    size="large"
                                />
                            </Form.Item>
                        </div>
                    </Form>

                    <Divider />

                    {/* Changes Preview */}
                    <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-700 mb-3">Xem trước thay đổi</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span>Thông tin sẽ được cập nhật sau khi lưu</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span>Các phương án trả lời sẽ được giữ nguyên</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                <span>Câu hỏi sẽ sẵn sàng để sử dụng</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        {!initialData && (
                            <>
                                <div className="text-gray-400 text-4xl mb-4">⚠️</div>
                                <p className="text-gray-600 font-medium">Không có dữ liệu câu hỏi</p>
                                <p className="text-sm text-gray-500 mt-2">Vui lòng chọn một câu hỏi để chỉnh sửa</p>
                            </>
                        )}
                        {!surveys.length && (
                            <>
                                <div className="text-gray-400 text-4xl mb-4">📊</div>
                                <p className="text-gray-600 font-medium">Đang tải danh sách khảo sát...</p>
                                <p className="text-sm text-gray-500 mt-2">Vui lòng đợi trong giây lát</p>
                            </>
                        )}
                        {initialData && surveys.length === 0 && (
                            <>
                                <div className="text-gray-400 text-4xl mb-4">❌</div>
                                <p className="text-gray-600 font-medium">Không có khảo sát khả dụng</p>
                                <p className="text-sm text-gray-500 mt-2">Vui lòng tạo khảo sát trước khi tạo câu hỏi</p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default QuestionUpdateModal;
