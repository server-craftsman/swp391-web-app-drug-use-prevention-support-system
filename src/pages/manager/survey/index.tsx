import React, { useEffect, useState } from "react";
import { Tabs, message } from "antd";
import { SurveyService } from "../../../services/survey/survey.service";
import type { SurveyResponse } from "../../../types/survey/Survey.res.type";
import { SurveyType } from "../../../app/enums/surveyType.enum";
import SurveyDetailDrawer from "../../../components/manager/survey/Detail.com";
import { QuestionService } from "../../../services/question/question.service";
import type { QuestionResponse } from "../../../types/question/Question.res.type";
import SurveyListComp from "../../../components/manager/survey/SurveyList.com";
import QuestionList from "../../../components/manager/survey/question/List.com";
import AnswerList from "../../../components/manager/survey/answer/List.com";
import type { TabsProps } from "antd";

const PAGE_SIZE_DEFAULT = 10;

const SurveyPageManagement: React.FC = () => {
    // Active tab state
    const [activeTab, setActiveTab] = useState("survey");

    // Survey tab state
    const [data, setData] = useState<SurveyResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
    const [total, setTotal] = useState(0);
    const [filterByName, setFilterByName] = useState("");
    const [surveyTypeFilter, setSurveyTypeFilter] = useState<SurveyType | undefined>(undefined);

    // Question tab state
    const [questionLoading, setQuestionLoading] = useState(false);
    const [questions, setQuestions] = useState<QuestionResponse[]>([]);
    const [qPage, setQPage] = useState(1);
    const [qSize, setQSize] = useState(PAGE_SIZE_DEFAULT);
    const [qTotal, setQTotal] = useState(0);
    const [qFilter, setQFilter] = useState("");
    const [surveyFilter, setSurveyFilter] = useState<string | undefined>();

    // fetch surveys for dropdowns
    const [allSurveys, setAllSurveys] = useState<SurveyResponse[]>([]);

    const [selectedSurvey, setSelectedSurvey] = useState<SurveyResponse | null>(null);

    // Refs to force refresh child components
    const [surveyRefreshKey, setSurveyRefreshKey] = useState(0);
    const [questionRefreshKey, setQuestionRefreshKey] = useState(0);
    const [answerRefreshKey, setAnswerRefreshKey] = useState(0);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await SurveyService.getAllSurveys({
                pageNumber,
                pageSize,
                filterByName,
            } as any);
            const resp: any = res?.data ?? {};
            const list = resp.data ?? [];
            const totalCount = resp.totalCount ?? list.length;
            setData(list);
            setTotal(totalCount);
            // store for dropdown if first fetch
            setAllSurveys(list);
        } catch (err) {
            message.error("Không thể tải danh sách khảo sát");
        } finally {
            setLoading(false);
        }
    };

    const fetchQuestions = async () => {
        try {
            setQuestionLoading(true);
            const res = await QuestionService.getAllQuestions({
                pageNumber: qPage,
                pageSize: qSize,
                surveyId: surveyFilter ?? "",
                filter: qFilter,
            } as any);
            const resp: any = res?.data ?? {};
            const list = resp.data ?? [];
            const totalCount = resp.totalCount ?? list.length;
            setQuestions(list);
            setQTotal(totalCount);
        } catch {
            message.error("Không thể tải câu hỏi");
        } finally {
            setQuestionLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pageNumber, pageSize, filterByName, surveyTypeFilter]);

    useEffect(() => {
        if (surveyFilter !== undefined) fetchQuestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qPage, qSize, surveyFilter, qFilter]);

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
