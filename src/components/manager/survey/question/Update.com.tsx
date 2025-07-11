import React from "react";
import { Modal, Form, Select, InputNumber } from "antd";
import { QuestionType } from "../../../../app/enums/questionType.enum";
import { QuestionService } from "../../../../services/question/question.service";
import type { QuestionResponse } from "../../../../types/question/Question.res.type";
import type { SurveyResponse } from "../../../../types/survey/Survey.res.type";
import { helpers } from "../../../../utils";
import Editor from "../../../common/Editor.com";

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

    // const getSurveyName = (surveyId: string) => {
    //     const survey = surveys.find(s => s.id === surveyId);
    //     return survey?.name || `Survey ID: ${surveyId}`;
    // };

    const handleEditorChange = (content: string) => {
        setEditorValue(content);
        form.setFieldsValue({ questionContent: content });
    };

    return (
        <Modal
            title="Cập nhật câu hỏi"
            open={open}
            onOk={handleOk}
            confirmLoading={submitting}
            onCancel={onClose}
            destroyOnClose
            width={600}
            style={{
                position: 'absolute',
                right: 0,
                top: 0,
                margin: 0,
                height: '100vh',
                maxWidth: '600px'
            }}
            bodyStyle={{
                height: 'calc(100vh - 110px)',
                overflowY: 'auto',
                padding: '24px'
            }}
            maskStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }}
        >
            {initialData && surveys.length > 0 ? (
                <Form form={form} layout="vertical" key={initialData.id}>
                    <Form.Item
                        name="surveyId"
                        label="Khảo sát"
                    >
                        <Select
                            placeholder="Chọn khảo sát"
                            disabled
                            value={initialData.surveyId}
                            showSearch
                            optionFilterProp="children"
                        >
                            {surveys.map((survey) => (
                                <Select.Option key={survey.id} value={survey.id}>
                                    {survey.name}
                                </Select.Option>
                            ))}
                        </Select>
                        <div className="text-sm text-gray-500 mt-1">
                            Không thể thay đổi khảo sát khi cập nhật câu hỏi
                        </div>
                    </Form.Item>

                    <Form.Item
                        name="questionContent"
                        label="Nội dung câu hỏi"
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}
                    >
                        <Editor
                            value={editorValue}
                            placeholder="Nhập nội dung câu hỏi..."
                            height={200}
                            onChange={handleEditorChange}
                        />
                    </Form.Item>

                    <Form.Item
                        name="questionType"
                        label="Loại câu hỏi"
                        rules={[{ required: true, message: 'Vui lòng chọn loại câu hỏi' }]}
                    >
                        <Select placeholder="Chọn loại câu hỏi">
                            {Object.values(QuestionType).map((type) => (
                                <Select.Option key={type} value={type}>
                                    {type === QuestionType.MULTIPLE_CHOICE ? "Trắc nghiệm" : type}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="positionOrder"
                        label="Thứ tự"
                        rules={[{ required: true, type: "number", min: 1, message: 'Vui lòng nhập thứ tự hợp lệ' }]}
                    >
                        <InputNumber
                            min={1}
                            max={1000}
                            placeholder="Nhập thứ tự câu hỏi"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Form>
            ) : (
                <div className="flex justify-center items-center py-8">
                    {!initialData && <p>Không có dữ liệu câu hỏi</p>}
                    {!surveys.length && <p>Đang tải danh sách khảo sát...</p>}
                    {initialData && surveys.length === 0 && (
                        <div>
                            <p>Không có khảo sát khả dụng</p>
                            <p className="text-sm text-gray-500">Surveys: {JSON.stringify(surveys)}</p>
                            <p className="text-sm text-gray-500">Question: {JSON.stringify(initialData)}</p>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default QuestionUpdateModal;
