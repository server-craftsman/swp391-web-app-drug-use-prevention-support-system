import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Typography, Button, Layout, Drawer, Breadcrumb } from "antd";
import { MenuUnfoldOutlined, HomeOutlined } from "@ant-design/icons";
import type { Program, ProgramEnrollment } from "../../../../types/program/Program.type";
import { ProgramService } from "../../../../services/program/program.service";
import { helpers } from "../../../../utils";
import { SurveyService } from "../../../../services/survey/survey.service";
import { SurveyType } from "../../../../app/enums/surveyType.enum";
import { ROUTER_URL } from "../../../../consts/router.path.const";
import type { SurveyResponse } from "../../../../types/survey/Survey.res.type";

// Import the new components
import ProgramMediaBanner from "../../../../components/client/program/ProgramMediaBanner.ui";
import ProgramVideoTabs from "../../../../components/client/program/video/ProgramVideoTabs.com";
import ProgramSidebar from "../../../../components/client/program/ProgramSidebar.ui";

const { Title } = Typography;

const ProgramDetail: React.FC = () => {
    const { programId } = useParams<{ programId: string }>();
    const navigate = useNavigate();

    // Create video ref for transcript integration
    const videoRef = useRef<HTMLVideoElement>(null);

    const [program, setProgram] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true);

    // Main content tab state
    const [activeMainTab, setActiveMainTab] = useState("overview");

    // Survey management - only PRE and POST feedback
    const [preFeedbackSurveys, setPreFeedbackSurveys] = useState<SurveyResponse[]>([]);
    const [postFeedbackSurveys, setPostFeedbackSurveys] = useState<SurveyResponse[]>([]);

    const [activeSurveyType, setActiveSurveyType] = useState<SurveyType>(SurveyType.PRE_FEEDBACK);
    const [selectedSurvey, setSelectedSurvey] = useState<any | null>(null);

    // UI state
    const [drawerVisible, setDrawerVisible] = useState(false);

    // Program viewing state for validation
    const [isProgramViewed, setIsProgramViewed] = useState(false);

    // Enrollment state
    const [enrollmentData, setEnrollmentData] = useState<ProgramEnrollment | null>(null);
    const [isEnrolled, setIsEnrolled] = useState(false);

    // Check if user is logged in
    const userInfo = localStorage.getItem("userInfo");
    const isLoggedIn = !!userInfo;

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

    // Check enrollment status
    useEffect(() => {
        const checkEnrollmentStatus = async () => {
            if (!isLoggedIn || !programId) return;

            try {
                const res = await ProgramService.programEnrollments();
                if (res?.data) {
                    const enrolledProgram = res.data.data.find(
                        (p: ProgramEnrollment) => (p.programId === programId || p.id === programId) && p.joinDate
                    );

                    if (enrolledProgram) {
                        setEnrollmentData(enrolledProgram);
                        setIsEnrolled(true);
                    } else {
                        setIsEnrolled(false);
                        setEnrollmentData(null);
                    }
                }
            } catch (err) {
                console.error("Error checking enrollment status:", err);
                setIsEnrolled(false);
                setEnrollmentData(null);
            }
        };

        checkEnrollmentStatus();
    }, [programId, isLoggedIn]);

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
            return;
        }

        // Questions are handled in the separate survey page
        // This effect can be removed if not needed for sidebar functionality
    }, [selectedSurvey]);

    // Intersection Observer to detect when program section is viewed
    useEffect(() => {
        const programSection = document.getElementById("program-section");
        if (!programSection) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                        // User has viewed at least 30% of the program section
                        setIsProgramViewed(true);
                        // Save to localStorage for persistence
                        localStorage.setItem(`program-viewed-${programId}`, 'true');
                    }
                });
            },
            {
                threshold: [0.3], // Trigger when 30% of the element is visible
                rootMargin: '-50px 0px' // Add some margin to ensure actual viewing
            }
        );

        observer.observe(programSection);

        return () => {
            observer.disconnect();
        };
    }, [programId, program]);

    // Load program viewed state from localStorage on mount
    useEffect(() => {
        if (programId) {
            const isViewed = localStorage.getItem(`program-viewed-${programId}`) === 'true';
            setIsProgramViewed(isViewed);
        }
    }, [programId]);

    // Handler functions for sidebar
    const handleSurveyTypeChange = (type: SurveyType) => {
        setActiveSurveyType(type);
    };

    const handleSurveySelect = (_: string) => { };

    // Cuộn tới khu vực chương trình (video + tabs)
    const scrollToProgram = () => {
        const target = document.getElementById("program-section");
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            // Mark program as viewed when user explicitly navigates to it
            setIsProgramViewed(true);
            if (programId) {
                localStorage.setItem(`program-viewed-${programId}`, 'true');
            }
            // Ẩn drawer trên mobile để cải thiện UX
            if (window.innerWidth < 768) setDrawerVisible(false);
        }
    };

    // Check if user can access the program (has joinDate)
    const canAccessProgram = isLoggedIn && isEnrolled && enrollmentData?.joinDate;

    // Sidebar content with Coursera-inspired design
    const sidebarContent = programId && canAccessProgram ? (
        <ProgramSidebar
            programName={program?.name || 'Chương trình'}
            programId={programId}
            preFeedbackSurveys={preFeedbackSurveys}
            postFeedbackSurveys={postFeedbackSurveys}
            activeSurveyType={activeSurveyType}
            onSurveyTypeChange={handleSurveyTypeChange}
            onSurveySelect={handleSurveySelect}
            onProgramClick={scrollToProgram}
            isProgramViewed={isProgramViewed}
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

    // If user is not logged in or not enrolled, redirect to program list
    if (!canAccessProgram) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '16px', backgroundColor: '#f8f9fa' }}>
                <Title level={3} style={{ color: '#718096' }}>
                    {!isLoggedIn ? 'Bạn cần đăng nhập để xem chương trình này' : 'Bạn cần tham gia chương trình để xem chi tiết'}
                </Title>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button type="primary" onClick={() => navigate(ROUTER_URL.CLIENT.PROGRAM)}>
                        Quay lại danh sách chương trình
                    </Button>
                    {!isLoggedIn && (
                        <Button onClick={() => navigate(ROUTER_URL.AUTH.LOGIN)}>
                            Đăng nhập
                        </Button>
                    )}
                </div>
                {enrollmentData?.joinDate && (
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                        <p style={{ color: '#52c41a', margin: 0 }}>
                            ✅ Đã tham gia chương trình từ: {new Date(enrollmentData.joinDate).toLocaleDateString('vi-VN')}
                        </p>
                    </div>
                )}
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

                        {/* Show enrollment info in header */}
                        {enrollmentData?.joinDate && (
                            <div style={{ fontSize: '14px', color: '#52c41a', fontWeight: 500 }}>
                                Đã tham gia: {new Date(enrollmentData.joinDate).toLocaleDateString('vi-VN')}
                            </div>
                        )}
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
            </Layout.Content>
        </Layout>
    );
};

export default ProgramDetail; 