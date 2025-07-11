import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Spin, Typography, Button, Form, message, Layout, Drawer, Breadcrumb } from "antd";
import { MenuUnfoldOutlined, LeftOutlined, HomeOutlined } from "@ant-design/icons";
import type { Program } from "../../../../types/program/Program.type";
import { ProgramService } from "../../../../services/program/program.service";
import { helpers } from "../../../../utils";
import { SurveyService } from "../../../../services/survey/survey.service";
import { QuestionService } from "../../../../services/question/question.service";
import { AnswerService } from "../../../../services/answer/answer.service";
import { SurveyType } from "../../../../app/enums/surveyType.enum";
import { ROUTER_URL } from "../../../../consts/router.path.const";

// Import the new components
import ProgramMediaBanner from "../../../../components/client/program/ProgramMediaBanner.ui";
import ProgramVideoTabs from "../../../../components/client/program/video/ProgramVideoTabs.com";
import ProgramSidebar from "../../../../components/client/program/ProgramSidebar.ui";

const { Title } = Typography;

const ProgramDetail: React.FC = () => {
    const { programId } = useParams<{ programId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // Create video ref for transcript integration
    const videoRef = useRef<HTMLVideoElement>(null);

    const [program, setProgram] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true);

    // Main content tab state
    const [activeMainTab, setActiveMainTab] = useState("overview");

    // Survey management - only PRE and POST feedback
    const [preFeedbackSurveys, setPreFeedbackSurveys] = useState<any[]>([]);
    const [postFeedbackSurveys, setPostFeedbackSurveys] = useState<any[]>([]);

    const [activeSurveyType, setActiveSurveyType] = useState<SurveyType>(SurveyType.PRE_FEEDBACK);
    const [selectedSurvey, setSelectedSurvey] = useState<any | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [answersMap, setAnswersMap] = useState<Record<string, any[]>>({});
    const [submitting, setSubmitting] = useState(false);

    // UI state
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());

    // No survey content on this page

    useEffect(() => {
        const fetchProgram = async () => {
            if (!programId) return;
            try {
                setLoading(true);
                const res = await ProgramService.getProgramById(programId);
                setProgram(res?.data ?? null);
            } catch {
                helpers.notificationMessage("Không thể tải chi tiết chương trình", "error");
                setProgram(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProgram();
    }, [programId]);

    // Fetch and categorize surveys
    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const res = await SurveyService.getAllSurveys({ pageNumber: 1, pageSize: 1000, filterByName: "" } as any);
                const surveys = res?.data?.data ?? [];

                // Only categorize PRE and POST feedback surveys
                const preFeedback = surveys.filter((s: any) => s.surveyType === SurveyType.PRE_FEEDBACK);
                const postFeedback = surveys.filter((s: any) => s.surveyType === SurveyType.POST_FEEDBACK);

                setPreFeedbackSurveys(preFeedback);
                setPostFeedbackSurveys(postFeedback);

                // Set default selected survey
                if (preFeedback.length > 0) {
                    setSelectedSurvey(preFeedback[0]);
                } else if (postFeedback.length > 0) {
                    setActiveSurveyType(SurveyType.POST_FEEDBACK);
                    setSelectedSurvey(postFeedback[0]);
                }
            } catch {
                helpers.notificationMessage("Không thể tải danh sách khảo sát", "error");
            }
        };
        fetchSurveys();
    }, []);

    // Update selected survey when survey type changes
    // Chỉ tự động chọn survey đầu tiên nếu survey hiện tại KHÔNG thuộc loại đang chọn
    useEffect(() => {
        const surveysForType = activeSurveyType === SurveyType.PRE_FEEDBACK ? preFeedbackSurveys : postFeedbackSurveys;

        // Nếu survey hiện tại đã thuộc danh sách của loại mới → giữ nguyên
        if (selectedSurvey && surveysForType.some((s) => s.id === selectedSurvey.id)) {
            return;
        }

        // Ngược lại, fallback chọn survey đầu tiên (nếu có) ‑ hoặc null
        if (surveysForType.length > 0) {
            setSelectedSurvey(surveysForType[0]);
        } else {
            setSelectedSurvey(null);
        }
    }, [activeSurveyType, preFeedbackSurveys, postFeedbackSurveys, selectedSurvey]);

    // Fetch questions when survey changes
    useEffect(() => {
        if (!selectedSurvey) {
            setQuestions([]);
            setAnswersMap({});
            return;
        }

        const fetchQs = async () => {
            try {
                const resQ = await QuestionService.getQuestionBySurveyId(selectedSurvey.id);
                const qs = resQ?.data ?? [];
                setQuestions(qs);
                setAnsweredIds(new Set());

                // Fetch answers for each question
                const ansPromises = qs.map((q: any) => AnswerService.getAnswerByQuestionId(q.id));
                const ansResults = await Promise.all(ansPromises);
                const map: Record<string, any[]> = {};
                qs.forEach((q: any, idx: number) => {
                    map[q.id] = (ansResults[idx] as any)?.data?.data ?? [];
                });
                setAnswersMap(map);
            } catch {
                helpers.notificationMessage("Không thể tải câu hỏi", "error");
            }
        };
        fetchQs();
    }, [selectedSurvey]);

    // // Extract survey param
    // const surveyQueryId = new URLSearchParams(location.search).get('survey');

    // useEffect(() => {
    //     if (surveyQueryId) {
    //         const sv = [...preFeedbackSurveys, ...postFeedbackSurveys].find(s => s.id === surveyQueryId);
    //         if (sv) setSelectedSurvey(sv);
    //     }
    // }, [surveyQueryId, preFeedbackSurveys, postFeedbackSurveys]);

    const handleFormChange = (changed: any, all: any) => {
        const ans = new Set<string>();
        Object.keys(all).forEach(k => { if (all[k]) ans.add(k); });
        setAnsweredIds(ans);
    };

    const scrollToQuestion = (qId: string) => {
        const el = document.getElementById(`q-${qId}`);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            if (window.innerWidth < 768) setDrawerVisible(false);
        }
    };

    const getCurrentSurveys = () => {
        return activeSurveyType === SurveyType.PRE_FEEDBACK ? preFeedbackSurveys : postFeedbackSurveys;
    };

    const [form] = Form.useForm();
    const userInfo = localStorage.getItem("userInfo");
    const userId = userInfo ? (() => { try { return JSON.parse(userInfo).id || ""; } catch { return "" } })() : "";

    const handleSubmitSurvey = async () => {
        try {
            const values = await form.validateFields();
            const answersArr = Object.keys(values).map(qId => ({ questionId: qId, answerOptionId: values[qId] }));
            setSubmitting(true);
            await SurveyService.submitSurvey({ userId, surveyId: selectedSurvey.id, answers: answersArr } as any);
            message.success("Đã gửi khảo sát thành công! Cảm ơn bạn đã tham gia.");
            form.resetFields();
            setAnsweredIds(new Set());
        } catch (err: any) {
            if (err?.errorFields) return;
            message.error("Gửi khảo sát thất bại. Vui lòng thử lại.");
        } finally { setSubmitting(false); }
    };

    // Handler functions for sidebar
    const handleSurveyTypeChange = (type: SurveyType) => {
        setActiveSurveyType(type);
        form.resetFields();
        // Navigate to survey page instead
        // handled in sidebar
    };

    const handleSurveySelect = (_: string) => { };

    // Cuộn tới khu vực chương trình (video + tabs)
    const scrollToProgram = () => {
        const target = document.getElementById("program-section");
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            // Ẩn drawer trên mobile để cải thiện UX
            if (window.innerWidth < 768) setDrawerVisible(false);
        }

        // Scroll only
    };

    // Sidebar content with Coursera-inspired design
    const sidebarContent = programId ? (
        <ProgramSidebar
            programName={program?.name || 'Chương trình'}
            programId={programId}
            preFeedbackSurveys={preFeedbackSurveys}
            postFeedbackSurveys={postFeedbackSurveys}
            activeSurveyType={activeSurveyType}
            selectedSurvey={selectedSurvey}
            questions={questions}
            answeredIds={answeredIds}
            onSurveyTypeChange={handleSurveyTypeChange}
            onSurveySelect={handleSurveySelect}
            onQuestionClick={scrollToQuestion}
            onProgramClick={scrollToProgram}
        />
    ) : null;

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!program) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '16px', backgroundColor: '#f8f9fa' }}>
                <Title level={3} style={{ color: '#718096' }}>Không tìm thấy chương trình</Title>
                <Button type="primary" onClick={() => navigate(-1)}>Quay lại</Button>
            </div>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
            {/* Mobile Drawer */}
            <Drawer
                title={null}
                placement="left"
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}
                bodyStyle={{ padding: 0 }}
                width={350}
                headerStyle={{ display: 'none' }}
            >
                {sidebarContent}
            </Drawer>

            {/* Desktop Sidebar */}
            <Layout.Sider
                width={350}
                breakpoint="lg"
                collapsedWidth="0"
                style={{
                    // backgroundColor: '#f8f9fa',
                    overflowY: 'auto',
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    borderRight: '1px solid #e8e8e8'
                }}
                className="hidden lg:block"
            >
                {sidebarContent}
            </Layout.Sider>

            <Layout.Content style={{ backgroundColor: '#ffffff' }}>
                {/* Navigation Header */}
                <div style={{
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #e8e8e8',
                    padding: '16px 0'
                }}>
                    <div style={{
                        maxWidth: '900px',
                        margin: '0 auto',
                        padding: '0 24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        {/* <Button
                            type="text"
                            icon={<LeftOutlined />}
                            onClick={() => navigate(ROUTER_URL.CLIENT.PROGRAM)}
                            style={{
                                color: '#0056d3',
                                fontWeight: 500,
                                padding: '4px 8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            Quay lại danh sách
                        </Button> */}
                        <Breadcrumb
                            style={{ flex: 1 }}
                            items={[
                                {
                                    href: ROUTER_URL.COMMON.HOME,
                                    title: (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <HomeOutlined />
                                            <span>Trang chủ</span>
                                        </div>
                                    ),
                                },
                                {
                                    href: ROUTER_URL.CLIENT.PROGRAM,
                                    title: 'Chương trình cộng đồng',
                                },
                                {
                                    title: program?.name || 'Chi tiết chương trình',
                                },
                            ]}
                        />
                    </div>
                </div>

                {/* Mobile menu button */}
                <div className="lg:hidden" style={{ padding: '16px', borderBottom: '1px solid #e8e8e8' }}>
                    <Button
                        icon={<MenuUnfoldOutlined />}
                        onClick={() => setDrawerVisible(true)}
                    >
                        Khảo sát chương trình
                    </Button>
                </div>

                {/* Main content */}
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
                    {/* Program content: video + tabs */}
                    {/* Media banner with video ref */}
                    <div id="program-section">
                        <ProgramMediaBanner program={program} videoRef={videoRef} />
                    </div>
                    {/* Video Content Tabs with video ref */}
                    <ProgramVideoTabs
                        program={program}
                        activeTab={activeMainTab}
                        onTabChange={setActiveMainTab}
                        videoRef={videoRef}
                    />
                </div>
                {/* Removed floating submit button */}
            </Layout.Content>
        </Layout>
    );
};

export default ProgramDetail; 