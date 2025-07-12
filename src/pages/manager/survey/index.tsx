import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import type { SurveyResponse } from "../../../types/survey/Survey.res.type";
import SurveyDetailDrawer from "../../../components/manager/survey/Detail.com";
import type { QuestionResponse } from "../../../types/question/Question.res.type";
import SurveyListComp from "../../../components/manager/survey/SurveyList.com";
import QuestionList from "../../../components/manager/survey/question/List.com";
import AnswerList from "../../../components/manager/survey/answer/List.com";
import type { TabsProps } from "antd";

const SurveyPageManagement: React.FC = () => {
    // Active tab state
    const [activeTab, setActiveTab] = useState("survey");

    // fetch surveys for dropdowns
    const [allSurveys, setAllSurveys] = useState<SurveyResponse[]>([]);
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);

    const [selectedSurvey, setSelectedSurvey] = useState<SurveyResponse | null>(null);

    // Refs to force refresh child components
    const [surveyRefreshKey, setSurveyRefreshKey] = useState(0);
    const [questionRefreshKey, setQuestionRefreshKey] = useState(0);
    const [answerRefreshKey, setAnswerRefreshKey] = useState(0);

    // Handle tab change - force refresh data for each tab
    const handleTabChange = (key: string) => {
        setActiveTab(key);

        // Force component remount by updating refresh key
        switch (key) {
            case 'survey':
                setSurveyRefreshKey(prev => prev + 1);
                break;
            case 'question':
                setQuestionRefreshKey(prev => prev + 1);
                break;
            case 'answer':
                setAnswerRefreshKey(prev => prev + 1);
                break;
        }
    };

    // Initial load on first mount
    useEffect(() => {
        if (activeTab === 'survey') {
            setSurveyRefreshKey(prev => prev + 1);
        }
    }, []);

    const items: TabsProps["items"] = [
        {
            key: "survey",
            label: "Bảng khảo sát",
            children: activeTab === "survey" ? (
                <SurveyListComp
                    key={surveyRefreshKey}
                    onSelectSurvey={setSelectedSurvey}
                    onLoadedSurveys={setAllSurveys}
                />
            ) : null,
        },
        {
            key: "question",
            label: "Bảng câu hỏi",
            children: activeTab === "question" ? (
                <QuestionList
                    key={questionRefreshKey}
                    surveys={allSurveys}
                    onLoadedQuestions={setQuestions}
                />
            ) : null,
        },
        {
            key: "answer",
            label: "Bảng câu trả lời",
            children: activeTab === "answer" ? (
                <AnswerList
                    key={answerRefreshKey}
                    questions={questions}
                />
            ) : null,
        },
    ];

    return (
        <div className="p-6 bg-white rounded-md">
            <h2 className="text-2xl font-semibold mb-4">Quản lý Khảo sát</h2>
            <Tabs
                items={items}
                activeKey={activeTab}
                onChange={handleTabChange}
            />

            {/* Drawer for survey detail (only from survey tab) */}
            <SurveyDetailDrawer
                open={!!selectedSurvey}
                onClose={() => setSelectedSurvey(null)}
                surveyId={selectedSurvey?.id}
                surveyName={selectedSurvey?.name}
                surveyType={selectedSurvey?.surveyType}
                surveyDescription={selectedSurvey?.description}
            />
        </div>
    );
};

export default SurveyPageManagement;
