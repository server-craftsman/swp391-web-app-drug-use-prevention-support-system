import React from "react";
import { Modal, Form, Input, Select, Spin, Tag } from "antd";
import { SurveyType } from "../../../app/enums/surveyType.enum";
import { SurveyService } from "../../../services/survey/survey.service";
import type { SurveyResponse } from "../../../types/survey/Survey.res.type";
import { helpers, color } from "../../../utils";
import Editor from "../../common/Editor.com";

interface Props {
    open: boolean;
    initialData: SurveyResponse | null;
    onClose: () => void;
    onSuccess: () => void;
}

const SurveyUpdateModal: React.FC<Props> = ({ open, initialData, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [surveyData, setSurveyData] = React.useState<SurveyResponse | null>(null);

    /* Load survey data when the modal opens */
    React.useEffect(() => {
        if (open && initialData?.id) {
            fetchSurveyById(initialData.id);
        } else if (!open) {
            setSurveyData(null);
            form.resetFields();
        }
    }, [open, initialData]);

    /* Populate form once data is available */
    React.useEffect(() => {
        if (surveyData && !loading) {
            let normalizedSurveyType: SurveyType = (surveyData.surveyType as SurveyType) || SurveyType.RISK_ASSESSMENT;

            if (!Object.values(SurveyType).includes(normalizedSurveyType)) {
                const matchingType = Object.values(SurveyType).find(
                    type =>
                        type.toLowerCase() === (normalizedSurveyType as any).toLowerCase() ||
                        type === (normalizedSurveyType as any).replace(/([A-Z])/g, " $1").trim()
                );
                normalizedSurveyType = matchingType || SurveyType.RISK_ASSESSMENT;
            }

            form.setFieldsValue({
                name: surveyData.name,
                description: surveyData.description,
                surveyType: normalizedSurveyType,
            });
        }
    }, [surveyData, loading, form]);

    const fetchSurveyById = async (id: string) => {
        try {
            setLoading(true);
            const response = await SurveyService.getSurveyById(id);
            const survey = (response as any)?.data?.data ?? (response as any)?.data ?? null;

            if (survey?.id) {
                // Normalize surveyType
                if (!survey.surveyType) {
                    survey.surveyType = (survey.type as SurveyType) || SurveyType.RISK_ASSESSMENT;
                }
                setSurveyData(survey);
            } else {
                throw new Error("Invalid survey data received");
            }
        } catch (error) {
            console.error("Error fetching survey:", error);
            helpers.notificationMessage("Không thể tải dữ liệu khảo sát", "error");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (!initialData?.id) return;

            let processedValues = {
                name: (values.name || "").trim(),
                description: values.description || "",
                surveyType: values.surveyType || SurveyType.RISK_ASSESSMENT
            };

            if (!processedValues.name) {
                helpers.notificationMessage("Tên khảo sát không được để trống", "error");
                return;
            }

            setSubmitting(true);

            await SurveyService.updateSurvey(initialData.id, processedValues);

            helpers.notificationMessage("Cập nhật khảo sát thành công", "success");
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error updating survey:", error);

            let errorMessage = "Có lỗi xảy ra khi cập nhật khảo sát";

            if (error?.message?.includes('Network Error') || error?.code === 'ERR_NETWORK') {
                errorMessage = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.";
            } else if (error?.response?.status === 500) {
                errorMessage = "Nội dung chứa ký tự không hợp lệ. Vui lòng thử lại với nội dung đơn giản hơn.";
            } else if (error?.response?.status === 404) {
                errorMessage = "Khảo sát không tồn tại hoặc đã bị xóa.";
            } else if (error?.response?.status === 400) {
                errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra thông tin.";
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            helpers.notificationMessage(errorMessage, "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="Cập nhật khảo sát"
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
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <Spin size="large" />
                </div>
            ) : surveyData ? (
                <Form form={form} layout="vertical" key={surveyData.id}>
                    <Form.Item
                        name="name"
                        label="Tên"
                        rules={[{ required: true, whitespace: true, message: "Vui lòng nhập tên" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                    >
                        <Editor placeholder="Nhập mô tả khảo sát..." height={300} />
                    </Form.Item>
                    <Form.Item
                        name="surveyType"
                        label="Loại"
                        rules={[{ required: true, message: "Vui lòng chọn loại" }]}
                    >
                        <Select placeholder="Chọn loại" allowClear optionLabelProp="label">
                            {Object.values(SurveyType).map((t) => (
                                <Select.Option
                                    key={t}
                                    value={t}
                                    label={
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Tag color={color.getSurveyTypeColor(t)} style={{ margin: 0, fontSize: '12px' }}>
                                                {t}
                                            </Tag>
                                        </div>
                                    }
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Tag color={color.getSurveyTypeColor(t)} style={{ margin: 0, fontSize: '12px' }}>
                                            {t}
                                        </Tag>
                                    </div>
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            ) : (
                <div className="flex justify-center items-center py-8">
                    <p>Không thể tải dữ liệu khảo sát</p>
                </div>
            )}
        </Modal>
    );
};

export default SurveyUpdateModal;
