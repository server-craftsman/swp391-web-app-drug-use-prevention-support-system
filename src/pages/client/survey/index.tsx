import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Spin, Button, Tag, Space } from 'antd';
import { SurveyService } from '../../../services/survey/survey.service';
import { QuestionService } from '../../../services/question/question.service';
import { SurveyType } from '../../../app/enums/surveyType.enum';
import { ROUTER_URL } from '../../../consts/router.path.const';

const { Title, Paragraph } = Typography;

const ClientSurvey: React.FC = () => {
    const { surveyId } = useParams<{ surveyId: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [survey, setSurvey] = useState<any | null>(null);
    const [questionCount, setQuestionCount] = useState(0);

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
                setQuestionCount(qs.length);
            } catch {
                // ignore
            } finally { setLoading(false); }
        };
        fetchData();
    }, [surveyId]);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><Spin size="large" /></div>;
    }

    if (!survey) {
        return <div style={{ textAlign: 'center', padding: 40 }}><Title level={4}>Không tìm thấy khảo sát</Title></div>;
    }

    const handleStart = () => {
        navigate(ROUTER_URL.CLIENT.SURVEY_ATTEMPT.replace(':surveyId', surveyId!));
    };

    return (
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 16px' }}>
            <Card bordered style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Title level={3} style={{ margin: 0 }}>{survey.name}</Title>
                    <Tag color={survey.surveyType === SurveyType.PRE_FEEDBACK ? 'green' : 'purple'}>
                        {survey.surveyType === SurveyType.PRE_FEEDBACK ? 'Khảo sát trước chương trình' : 'Khảo sát sau chương trình'}
                    </Tag>
                    {survey.description && <Paragraph>{survey.description}</Paragraph>}
                    <Paragraph>{questionCount} câu hỏi · Ước tính {Math.max(1, Math.round(questionCount * 0.5))} phút để hoàn thành</Paragraph>
                    <Button type="primary" size="large" onClick={handleStart}>
                        Bắt đầu khảo sát
                    </Button>
                </Space>
            </Card>
        </div>
    );
};

export default ClientSurvey;