import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin, Typography, Form, message, Radio, Space, Checkbox } from "antd";
import { LeftOutlined, ClockCircleOutlined, LikeOutlined, DislikeOutlined, FlagOutlined } from "@ant-design/icons";
import { SurveyService } from "../../../../services/survey/survey.service";
import { QuestionService } from "../../../../services/question/question.service";
import { AnswerService } from "../../../../services/answer/answer.service";
import { SurveyType } from "../../../../app/enums/surveyType.enum";

const { Title, Text, Link } = Typography;

const ClientSurveyDetail: React.FC = () => {
    const { surveyId } = useParams<{ surveyId: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [survey, setSurvey] = useState<any | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [answersMap, setAnswersMap] = useState<Record<string, any[]>>({});
    const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
    const [submitting, setSubmitting] = useState(false);
    const [honorCodeAccepted, setHonorCodeAccepted] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    const [form] = Form.useForm();

    // Fetch survey & questions
    useEffect(() => {
        if (!surveyId) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const resSurvey = await SurveyService.getSurveyById(surveyId);
                const sv = resSurvey?.data ?? null;
                setSurvey(sv);

                const resQ = await QuestionService.getQuestionBySurveyId(surveyId);
                const qs = resQ?.data ?? [];
                setQuestions(qs);

                // fetch answers for each question
                const ansPromises = qs.map((q: any) => AnswerService.getAnswerByQuestionId(q.id));
                const ansResults = await Promise.all(ansPromises);
                const map: Record<string, any[]> = {};
                qs.forEach((q: any, idx: number) => {
                    map[q.id] = ansResults[idx].data ?? [];
                });

                setAnswersMap(map);
            } catch (err) {
                message.error("Không thể tải khảo sát");
            } finally { setLoading(false); }
        };

        fetchData();
    }, [surveyId]);

    const handleFormChange = (_changed: any, all: any) => {
        const ans = new Set<string>();
        Object.keys(all).forEach(k => { if (all[k]) ans.add(k); });
        setAnsweredIds(ans);
    };

    const userInfo = localStorage.getItem("userInfo");
    const userId = userInfo ? (() => { try { return JSON.parse(userInfo).id || ""; } catch { return "" } })() : "";
    const userName = userInfo ? (() => { try { return JSON.parse(userInfo).firstName + " " + JSON.parse(userInfo).lastName || "User"; } catch { return "User" } })() : "User";

    const handleSubmit = async () => {
        if (!honorCodeAccepted) {
            message.error("Bạn phải chấp nhận cam kết trung thực để gửi bài làm");
            return;
        }

        try {
            const values = await form.validateFields();
            const answersArr = Object.keys(values).map(qId => ({ questionId: qId, answerOptionId: values[qId] }));
            setSubmitting(true);
            await SurveyService.submitSurvey({ userId, surveyId: surveyId!, answers: answersArr } as any);
            message.success("Đã gửi khảo sát. Cảm ơn!");
            navigate(-1);
        } catch (err: any) {
            if (err?.errorFields) return;
            message.error("Gửi khảo sát thất bại");
        } finally { setSubmitting(false); }
    };

    const handleSaveDraft = () => {
        // Save draft functionality
        const now = new Date();
        const timeString = now.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        setLastSaved(`Last saved on ${timeString} +07`);
        message.success("Đã lưu nháp");
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#f8f9fa'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!survey) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '40px',
                backgroundColor: '#f8f9fa',
                minHeight: '100vh'
            }}>
                <Title level={4}>Không tìm thấy khảo sát</Title>
            </div>
        );
    }

    // Calculate estimated time (30 seconds per question)
    const estimatedMinutes = Math.max(1, Math.round(questions.length * 0.5));

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#ffffff',
            paddingBottom: '80px'
        }}>
            {/* Header */}
            <div style={{
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e5e5e5',
                padding: '16px 0'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Button
                            type="text"
                            icon={<LeftOutlined />}
                            onClick={() => navigate(-1)}
                            style={{
                                color: '#0056d3',
                                fontWeight: 500,
                                padding: '4px 8px'
                            }}
                        >
                            Back
                        </Button>
                        <div>
                            <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>
                                {survey.name}
                            </Title>
                            <Text style={{
                                color: '#666666',
                                fontSize: '14px'
                            }}>
                                {survey.surveyType === SurveyType.PRE_FEEDBACK ? 'Khảo sát trước' : 'Khảo sát sau'} • {estimatedMinutes} phút
                            </Text>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ClockCircleOutlined style={{ color: '#666666' }} />
                        <Text style={{ color: '#666666', fontSize: '14px' }}>
                            Thời gian còn lại: Không giới hạn
                        </Text>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '32px 24px'
            }}>
                <Form
                    form={form}
                    layout="vertical"
                    onValuesChange={handleFormChange}
                // style={{ backgroundColor: 'transparent' }}
                >
                    {questions.map((question, index) => (
                        <div
                            key={question.id}
                            style={{
                                backgroundColor: '#ffffff',
                                padding: '32px 0',
                                marginBottom: '32px',
                                borderBottom: index < questions.length - 1 ? '1px solid #e5e5e5' : 'none'
                            }}
                        >
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '16px',
                                    marginBottom: '8px'
                                }}>
                                    <Text strong style={{
                                        fontSize: '16px',
                                        color: '#1a1a1a',
                                        minWidth: '20px'
                                    }}>
                                        {index + 1}.
                                    </Text>
                                    <div style={{ flex: 1 }}>
                                        <Text style={{
                                            fontSize: '16px',
                                            color: '#1a1a1a',
                                            lineHeight: '1.5'
                                        }}>
                                            {question.questionText || question.questionContent || 'Câu hỏi không có nội dung'}
                                        </Text>
                                        {/* Hide score display */}
                                        {/* <div style={{ 
                                            fontSize: '14px',
                                            color: '#666666',
                                            marginTop: '8px'
                                        }}>
                                            1 điểm
                                        </div> */}
                                    </div>
                                </div>
                            </div>

                            <Form.Item
                                name={question.id}
                                rules={[{ required: true, message: "Vui lòng chọn một câu trả lời" }]}
                                style={{ marginBottom: 0 }}
                            >
                                <Radio.Group style={{ width: '100%' }}>
                                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                                        {answersMap[question.id]?.map((answerOption: any) => (
                                            <Radio
                                                key={answerOption.id}
                                                value={answerOption.id}
                                                style={{
                                                    width: '100%',
                                                    padding: '8px 0',
                                                    backgroundColor: '#ffffff',
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    lineHeight: '1.5',
                                                    margin: 0,
                                                    border: 'none'
                                                }}
                                            >
                                                <span style={{
                                                    color: '#1a1a1a',
                                                    fontSize: '15px',
                                                    marginLeft: '8px'
                                                }}>
                                                    {answerOption.optionContent || answerOption.answerText || answerOption.answerContent || answerOption.text || answerOption.content || 'Không có nội dung'}
                                                </span>
                                            </Radio>
                                        ))}
                                    </Space>
                                </Radio.Group>
                            </Form.Item>
                        </div>
                    ))}
                </Form>

                {/* Honor Code Section */}
                {questions.length > 0 && (
                    <div style={{
                        backgroundColor: '#ffffff',
                        padding: '32px 0',
                        borderTop: '1px solid #e5e5e5',
                        marginTop: '32px'
                    }}>
                        <div style={{ marginBottom: '24px' }}>
                            <Title level={5} style={{ margin: 0, marginBottom: '16px', color: '#1a1a1a' }}>
                                Cam kết trung thực{' '}
                                <Link href="#" style={{ fontSize: '14px' }}>
                                    Tìm hiểu thêm ↗
                                </Link>
                            </Title>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <Checkbox
                                    checked={honorCodeAccepted}
                                    onChange={(e) => setHonorCodeAccepted(e.target.checked)}
                                    style={{ marginTop: '2px' }}
                                />
                                <Text style={{ color: '#1a1a1a', lineHeight: '1.5' }}>
                                    Tôi, <strong>{userName}</strong>, hiểu rằng gửi bài làm không phải của tôi có thể dẫn đến việc bị điểm 0 cho khóa học hoặc chương trình cộng đồng.
                                </Text>
                            </div>

                            {!honorCodeAccepted && (
                                <Text style={{
                                    color: '#d32f2f',
                                    fontSize: '14px',
                                    display: 'block',
                                    marginTop: '8px',
                                    marginLeft: '32px'
                                }}>
                                    Bạn phải chọn checkbox để gửi bài làm
                                </Text>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                            <Button
                                type="primary"
                                size="large"
                                loading={submitting}
                                disabled={!honorCodeAccepted || answeredIds.size !== questions.length}
                                onClick={handleSubmit}
                                style={{
                                    backgroundColor: honorCodeAccepted && answeredIds.size === questions.length ? '#0056d3' : '#c4c4c4',
                                    borderColor: honorCodeAccepted && answeredIds.size === questions.length ? '#0056d3' : '#c4c4c4',
                                    borderRadius: '4px',
                                    fontWeight: 500,
                                    fontSize: '14px',
                                    height: '40px',
                                    paddingLeft: '24px',
                                    paddingRight: '24px'
                                }}
                            >
                                {submitting ? 'Đang gửi...' : 'Gửi'}
                            </Button>

                            <Button
                                size="large"
                                onClick={handleSaveDraft}
                                style={{
                                    borderColor: '#0056d3',
                                    color: '#0056d3',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '4px',
                                    fontWeight: 500,
                                    fontSize: '14px',
                                    height: '40px',
                                    paddingLeft: '20px',
                                    paddingRight: '20px'
                                }}
                            >
                                Lưu bản nháp
                            </Button>
                        </div>

                        {/* Last saved info */}
                        {lastSaved && (
                            <Text style={{
                                color: '#666666',
                                fontSize: '14px',
                                display: 'block',
                                marginBottom: '24px'
                            }}>
                                {lastSaved}
                            </Text>
                        )}

                        {/* Like/Dislike/Report Section */}
                        <div style={{
                            display: 'flex',
                            gap: '24px',
                            paddingTop: '16px',
                            borderTop: '1px solid #e5e5e5'
                        }}>
                            <Button
                                type="text"
                                icon={<LikeOutlined />}
                                style={{
                                    color: '#0056d3',
                                    padding: '4px 8px',
                                    height: 'auto',
                                    fontSize: '14px'
                                }}
                            >
                                Like
                            </Button>
                            <Button
                                type="text"
                                icon={<DislikeOutlined />}
                                style={{
                                    color: '#0056d3',
                                    padding: '4px 8px',
                                    height: 'auto',
                                    fontSize: '14px'
                                }}
                            >
                                Dislike
                            </Button>
                            <Button
                                type="text"
                                icon={<FlagOutlined />}
                                style={{
                                    color: '#0056d3',
                                    padding: '4px 8px',
                                    height: 'auto',
                                    fontSize: '14px'
                                }}
                            >
                                Report an issue
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientSurveyDetail; 