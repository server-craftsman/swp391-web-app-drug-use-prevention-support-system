import React, { useState, useEffect } from "react";
import { Typography, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { FormOutlined, StarOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { SurveyType } from "../../../app/enums/surveyType.enum";
import { ROUTER_URL } from "../../../consts/router.path.const";

const { Title } = Typography;

interface ProgramSidebarProps {
    programName: string;
    programId: string;
    preFeedbackSurveys: any[];
    postFeedbackSurveys: any[];
    activeSurveyType: SurveyType;
    onSurveyTypeChange: (type: SurveyType) => void;
    onSurveySelect: (surveyId: string) => void;
    onProgramClick?: () => void;
}

const ProgramSidebar: React.FC<ProgramSidebarProps> = ({
    programName,
    programId,
    preFeedbackSurveys,
    postFeedbackSurveys,
    activeSurveyType,
    onSurveyTypeChange,
    onSurveySelect,
    onProgramClick
}) => {
    const navigate = useNavigate();
    const [selectedCategoryKey, setSelectedCategoryKey] = useState<'pre' | 'program' | 'post'>(
        activeSurveyType === SurveyType.POST_FEEDBACK ? 'post' : 'pre'
    );

    useEffect(() => {
        if (activeSurveyType === SurveyType.PRE_FEEDBACK) setSelectedCategoryKey('pre');
        if (activeSurveyType === SurveyType.POST_FEEDBACK) setSelectedCategoryKey('post');
    }, [activeSurveyType]);

    const handleCategoryClick = (info: any) => {
        const { key, keyPath } = info;
        if (keyPath.length === 2) {
            setSelectedCategoryKey(keyPath[1]);
            if (keyPath[1] === 'pre') onSurveyTypeChange(SurveyType.PRE_FEEDBACK);
            if (keyPath[1] === 'post') onSurveyTypeChange(SurveyType.POST_FEEDBACK);
            onSurveySelect(key);
            navigate(ROUTER_URL.CLIENT.SURVEY_ATTEMPT.replace(':surveyId', key));
            return;
        }
        setSelectedCategoryKey(key);
        navigate(ROUTER_URL.CLIENT.PROGRAM_DETAIL.replace(':programId', programId));

        if (key === 'pre') {
            onSurveyTypeChange(SurveyType.PRE_FEEDBACK);
        } else if (key === 'post') {
            onSurveyTypeChange(SurveyType.POST_FEEDBACK);
        } else if (key === 'program') {
            onSurveySelect('');
            onProgramClick?.();
        }
    };

    const categoryMenuItems = [
        {
            key: 'pre',
            icon: <FormOutlined style={{ color: '#52c41a' }} />,
            label: (
                <span>
                    Khảo sát trước
                    {preFeedbackSurveys.length > 0 && (
                        <span style={{ marginLeft: 6, color: '#52c41a' }}>({preFeedbackSurveys.length})</span>
                    )}
                </span>
            ),
            children: preFeedbackSurveys.map(s => ({ key: s.id, label: s.name })),
        },
        {
            key: 'program',
            icon: <PlayCircleOutlined style={{ color: '#20558A' }} />,
            label: 'Chương trình',
        },
        {
            key: 'post',
            icon: <StarOutlined style={{ color: '#722ed1' }} />,
            label: (
                <span>
                    Khảo sát sau
                    {postFeedbackSurveys.length > 0 && (
                        <span style={{ marginLeft: 6, color: '#722ed1' }}>({postFeedbackSurveys.length})</span>
                    )}
                </span>
            ),
            children: postFeedbackSurveys.map(s => ({ key: s.id, label: s.name })),
        },
    ];

    return (
        <>
            <div style={{ height: '100%', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e8e8e8' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #e8e8e8' }}>
                    <Title level={4} style={{ margin: 0, color: '#2d3748' }}>{programName}</Title>
                    <p style={{ fontSize: '13px', color: '#718096', margin: '4px 0 0 0' }}>Đánh giá và phản hồi</p>
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={[selectedCategoryKey]}
                    onClick={handleCategoryClick}
                    items={categoryMenuItems}
                    style={{ border: 'none', padding: '16px 0' }}
                    className="program-sidebar-category"
                />
            </div>
            <style>{`
            .program-sidebar-category .ant-menu-item {
                padding-left: 24px !important;
            }
            .program-sidebar-category .ant-menu-item-selected {
                background-color: #f0f5ff !important;
                border-left: 4px solid #20558A !important;
                padding-left: 20px !important;
            }
        `}</style>
        </>
    );
};

export default ProgramSidebar; 