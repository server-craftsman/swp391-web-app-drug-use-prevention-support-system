import React, { useState, useEffect } from "react";
import { Typography, Menu, message, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import {
    FormOutlined,
    StarOutlined,
    PlayCircleOutlined,
    CheckCircleOutlined,
    LockOutlined
} from "@ant-design/icons";
import { SurveyType } from "../../../app/enums/surveyType.enum";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { SurveyResponse } from "../../../types/survey/Survey.res.type";

const { Title } = Typography;

interface ProgramSidebarProps {
    programName: string;
    programId: string;
    preFeedbackSurveys: SurveyResponse[];
    postFeedbackSurveys: SurveyResponse[];
    activeSurveyType: SurveyType;
    onSurveyTypeChange: (type: SurveyType) => void;
    onSurveySelect: (surveyId: string) => void;
    onProgramClick?: () => void;
    isProgramViewed?: boolean; // Thêm prop để track việc đã xem program
}

const ProgramSidebar: React.FC<ProgramSidebarProps> = ({
    programName,
    programId,
    preFeedbackSurveys,
    postFeedbackSurveys,
    activeSurveyType,
    onSurveyTypeChange,
    onSurveySelect,
    onProgramClick,
    isProgramViewed = false
}) => {
    const navigate = useNavigate();
    const [selectedCategoryKey, setSelectedCategoryKey] = useState<'pre' | 'program' | 'post'>(
        activeSurveyType === SurveyType.POST_FEEDBACK ? 'post' : 'pre'
    );

    useEffect(() => {
        if (activeSurveyType === SurveyType.PRE_FEEDBACK) setSelectedCategoryKey('pre');
        if (activeSurveyType === SurveyType.POST_FEEDBACK) setSelectedCategoryKey('post');
    }, [activeSurveyType]);

    // Validation logic
    const isAllPreSurveysCompleted = preFeedbackSurveys.every(survey => survey.isCompleted);
    const canAccessProgram = isAllPreSurveysCompleted;
    const canAccessPostSurveys = canAccessProgram && isProgramViewed;

    const completedPreSurveysCount = preFeedbackSurveys.filter(survey => survey.isCompleted).length;
    const completedPostSurveysCount = postFeedbackSurveys.filter(survey => survey.isCompleted).length;

    const validateAndExecuteAction = (action: () => void, validationKey: 'pre' | 'program' | 'post') => {
        let canExecute = true;
        let errorMessage = '';

        switch (validationKey) {
            case 'program':
                if (!canAccessProgram) {
                    canExecute = false;
                    errorMessage = 'Bạn cần hoàn thành tất cả khảo sát trước để xem chương trình!';
                }
                break;
            case 'post':
                if (!canAccessPostSurveys) {
                    canExecute = false;
                    if (!isAllPreSurveysCompleted) {
                        errorMessage = 'Bạn cần hoàn thành khảo sát trước và xem chương trình để làm khảo sát sau!';
                    } else {
                        errorMessage = 'Bạn cần xem chương trình để làm khảo sát sau!';
                    }
                }
                break;
            default:
                // Pre surveys can always be accessed
                break;
        }

        if (canExecute) {
            action();
        } else {
            message.warning(errorMessage);
        }
    };

    const handleCategoryClick = (info: any) => {
        const { key, keyPath } = info;

        // Handle survey item click
        if (keyPath.length === 2) {
            const surveyId = key;
            const categoryKey = keyPath[1] as 'pre' | 'post';

            const executeNavigation = () => {
                setSelectedCategoryKey(categoryKey);
                if (categoryKey === 'pre') onSurveyTypeChange(SurveyType.PRE_FEEDBACK);
                if (categoryKey === 'post') onSurveyTypeChange(SurveyType.POST_FEEDBACK);
                onSurveySelect(surveyId);
                navigate(ROUTER_URL.CLIENT.SURVEY_ATTEMPT.replace(':surveyId', surveyId));
            };

            // Validate access for post surveys
            if (categoryKey === 'post') {
                validateAndExecuteAction(executeNavigation, 'post');
            } else {
                executeNavigation();
            }
            return;
        }

        // Handle category click
        const categoryKey = key as 'pre' | 'program' | 'post';

        const executeAction = () => {
            setSelectedCategoryKey(categoryKey);
            navigate(ROUTER_URL.CLIENT.PROGRAM_DETAIL.replace(':programId', programId));

            if (categoryKey === 'pre') {
                onSurveyTypeChange(SurveyType.PRE_FEEDBACK);
            } else if (categoryKey === 'post') {
                onSurveyTypeChange(SurveyType.POST_FEEDBACK);
            } else if (categoryKey === 'program') {
                onSurveySelect('');
                onProgramClick?.();
            }
        };

        validateAndExecuteAction(executeAction, categoryKey);
    };

    const getSurveyItemLabel = (survey: SurveyResponse) => (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{survey.name}</span>
            {survey.isCompleted && (
                <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: 8 }} />
            )}
        </span>
    );

    const getCategoryLabel = (type: 'pre' | 'post', surveys: SurveyResponse[], completedCount: number) => {
        const totalCount = surveys.length;
        const isLocked = type === 'post' && !canAccessPostSurveys;

        return (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ opacity: isLocked ? 0.5 : 1 }}>
                    {type === 'pre' ? 'Khảo sát trước' : 'Khảo sát sau'}
                    {totalCount > 0 && (
                        <span style={{
                            marginLeft: 6,
                            color: type === 'pre' ? '#52c41a' : '#722ed1',
                            opacity: isLocked ? 0.5 : 1
                        }}>
                            ({completedCount}/{totalCount})
                        </span>
                    )}
                </span>
                {isLocked && <LockOutlined style={{ color: '#d9d9d9', fontSize: '12px' }} />}
            </span>
        );
    };

    const getProgramLabel = () => {
        const isLocked = !canAccessProgram;

        return (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ opacity: isLocked ? 0.5 : 1 }}>
                    Chương trình
                    {isProgramViewed && (
                        <CheckCircleOutlined style={{ color: '#20558A', marginLeft: 8 }} />
                    )}
                </span>
                {isLocked && <LockOutlined style={{ color: '#d9d9d9', fontSize: '12px' }} />}
            </span>
        );
    };

    const categoryMenuItems = [
        {
            key: 'pre',
            icon: <FormOutlined style={{ color: '#52c41a' }} />,
            label: getCategoryLabel('pre', preFeedbackSurveys, completedPreSurveysCount),
            children: preFeedbackSurveys.map(survey => ({
                key: survey.id,
                label: getSurveyItemLabel(survey)
            })),
        },
        {
            key: 'program',
            icon: <PlayCircleOutlined style={{ color: canAccessProgram ? '#20558A' : '#d9d9d9' }} />,
            label: canAccessProgram ? (
                getProgramLabel()
            ) : (
                <Tooltip title="Hoàn thành tất cả khảo sát trước để mở khóa">
                    {getProgramLabel()}
                </Tooltip>
            ),
            disabled: !canAccessProgram,
        },
        {
            key: 'post',
            icon: <StarOutlined style={{ color: canAccessPostSurveys ? '#722ed1' : '#d9d9d9' }} />,
            label: canAccessPostSurveys ? (
                getCategoryLabel('post', postFeedbackSurveys, completedPostSurveysCount)
            ) : (
                <Tooltip title={!isAllPreSurveysCompleted
                    ? "Hoàn thành khảo sát trước và xem chương trình để mở khóa"
                    : "Xem chương trình để mở khóa khảo sát sau"
                }>
                    {getCategoryLabel('post', postFeedbackSurveys, completedPostSurveysCount)}
                </Tooltip>
            ),
            children: canAccessPostSurveys ? postFeedbackSurveys.map(survey => ({
                key: survey.id,
                label: getSurveyItemLabel(survey)
            })) : [],
            disabled: !canAccessPostSurveys,
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
            .program-sidebar-category .ant-menu-item-disabled {
                opacity: 0.5 !important;
                cursor: not-allowed !important;
            }
            .program-sidebar-category .ant-menu-item-disabled:hover {
                background-color: transparent !important;
            }
        `}</style>
        </>
    );
};

export default ProgramSidebar; 