import { useState, useEffect } from "react";
import { Modal, message } from "antd";
import {
    CheckCircleOutlined,
    LoadingOutlined,
    ArrowRightOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined,
    BookOutlined,
    TeamOutlined,
    PlayCircleOutlined,
    LockOutlined,
    ClockCircleOutlined
} from "@ant-design/icons";
import { ProgramService } from "../../../services/program/program.service";
import { CourseService } from "../../../services/course/course.service";
import type { Program } from "../../../types/program/Program.type";
import type { Course } from "../../../types/course/Course.res.type";
import { RiskLevel } from "../../../app/enums/riskLevel.enum";
import { ROUTER_URL } from "../../../consts/router.path.const";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/Auth.context";
import { debugAPI } from "../../../utils/debug";

interface AssessmentResultProps {
    surveyResult: any;
    onBack?: () => void;
    onStartNewAssessment?: () => void;
}

interface RecommendationItem {
    id: string;
    name: string;
    description: string;
    type: 'course' | 'program';
    riskLevel: RiskLevel;
    imageUrl?: string;
    price?: number;
    duration?: string;
    location?: string;
    status?: string;
    programVidUrl?: string;
}

export default function AssessmentResult({
    surveyResult,
    onBack,
    onStartNewAssessment
}: AssessmentResultProps) {
    const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [enrolling, setEnrolling] = useState<string | null>(null);
    const [enrolledPrograms, setEnrolledPrograms] = useState<Map<string, any>>(new Map());
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    const isLoggedIn = !!userInfo;

    // Use risk level from API response instead of calculating
    const calculateRiskLevel = (result: any): RiskLevel => {
        // If API provides riskLevel, use it directly
        if (result.riskLevel) {
            switch (result.riskLevel.toLowerCase()) {
                case 'none':
                    return RiskLevel.NONE;
                case 'low':
                    return RiskLevel.LOW;
                case 'medium':
                    return RiskLevel.MEDIUM;
                case 'high':
                    return RiskLevel.HIGH;
                case 'very_high':
                case 'veryhigh':
                    return RiskLevel.VERY_HIGH;
                default:
                    console.warn('AssessmentResult: Unknown risk level from API:', result.riskLevel);
            }
        }

        // Fallback to calculation if no riskLevel provided
        const totalScore = result.totalScore || result.answers?.reduce((sum: number, answer: any) => {
            return sum + (answer.score || 0);
        }, 0) || 0;

        if (totalScore <= 10) return RiskLevel.NONE;
        if (totalScore <= 20) return RiskLevel.LOW;
        if (totalScore <= 30) return RiskLevel.MEDIUM;
        if (totalScore <= 40) return RiskLevel.HIGH;
        return RiskLevel.VERY_HIGH;
    };

    const getRiskLevelInfo = (riskLevel: RiskLevel) => {
        switch (riskLevel) {
            case RiskLevel.NONE:
                return {
                    label: 'Không có nguy cơ',
                    color: 'text-green-600',
                    bgColor: 'bg-green-100',
                    description: 'Bạn không có dấu hiệu sử dụng chất gây nghiện. Hãy duy trì lối sống lành mạnh này!'
                };
            case RiskLevel.LOW:
                return {
                    label: 'Nguy cơ thấp',
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-100',
                    description: 'Bạn có một số dấu hiệu nhẹ. Hãy tham gia các khóa học phòng ngừa để nâng cao nhận thức.'
                };
            case RiskLevel.MEDIUM:
                return {
                    label: 'Nguy cơ trung bình',
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-100',
                    description: 'Bạn có dấu hiệu sử dụng chất gây nghiện ở mức độ trung bình. Cần can thiệp sớm.'
                };
            case RiskLevel.HIGH:
                return {
                    label: 'Nguy cơ cao',
                    color: 'text-orange-600',
                    bgColor: 'bg-orange-100',
                    description: 'Bạn có dấu hiệu sử dụng chất gây nghiện ở mức độ cao. Cần can thiệp chuyên môn.'
                };
            case RiskLevel.VERY_HIGH:
                return {
                    label: 'Nguy cơ rất cao',
                    color: 'text-red-600',
                    bgColor: 'bg-red-100',
                    description: 'Bạn có dấu hiệu nghiện nặng. Cần can thiệp y tế và tư vấn chuyên môn ngay lập tức.'
                };
            default:
                return {
                    label: 'Không xác định',
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-100',
                    description: 'Không thể xác định mức độ nguy cơ.'
                };
        }
    };

    // Fetch user's enrolled programs
    const fetchEnrolledPrograms = async () => {
        if (!isLoggedIn) return;

        try {
            const res = await ProgramService.programEnrollments();

            if (res?.data) {
                const enrolledMap = new Map<string, any>();
                res.data.data.forEach((program: any) => {
                    const key = program.programId || program.id;

                    if (key) {
                        enrolledMap.set(key, program);
                    }
                });
                setEnrolledPrograms(enrolledMap);
            }
        } catch (err) {
            console.error("Error fetching enrolled programs:", err);
        }
    };

    useEffect(() => {
        fetchRecommendations();
        fetchEnrolledPrograms();
    }, [surveyResult]);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            setError(null);

            const riskLevel = calculateRiskLevel(surveyResult);

            const [coursesResponse, programsResponse] = await Promise.all([
                CourseService.getAllCourses({ pageNumber: 1, pageSize: 10 }),
                ProgramService.getAllPrograms({ pageNumber: 1, pageSize: 10 })
            ]);

            const courses: RecommendationItem[] = (coursesResponse.data?.data || []).map((course: Course) => ({
                id: course.id,
                name: course.name,
                description: course.content,
                type: 'course' as const,
                riskLevel: course.riskLevel,
                imageUrl: course.imageUrls?.[0],
                price: course.price,
                duration: '4-6 tuần',
                status: course.status
            }));

            const programs: RecommendationItem[] = (programsResponse.data?.data || []).map((program: Program) => ({
                id: program.id || '',
                name: program.name || '',
                description: program.description || '',
                type: 'program' as const,
                riskLevel: program.riskLevel,
                imageUrl: program.programImgUrl,
                location: program.location,
                duration: `${program.startDate} - ${program.endDate}`,
                programVidUrl: program.programVidUrl
            }));

            // Combine and sort by relevance
            const allRecommendations = [...courses, ...programs]
                .filter(item => item.riskLevel === riskLevel)
                .slice(0, 6); // Limit to 6 recommendations

            setRecommendations(allRecommendations);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setError('Không thể tải đề xuất. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleEnrollProgram = async (programId: string) => {
        if (!isLoggedIn) {
            Modal.confirm({
                title: 'Đăng nhập để tham gia',
                content: 'Bạn cần đăng nhập để tham gia chương trình này.',
                okText: 'Đăng nhập',
                cancelText: 'Hủy',
                onOk: () => navigate(ROUTER_URL.AUTH.LOGIN),
            });
            return;
        }

        try {
            setEnrolling(programId);
            await ProgramService.enrollProgram(programId);
            message.success("Đã tham gia chương trình thành công!");

            // Refresh enrolled programs
            await fetchEnrolledPrograms();
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || "Không thể tham gia chương trình";
            message.error(errorMsg);
        } finally {
            setEnrolling(null);
        }
    };

    const handleCourseClick = (course: RecommendationItem) => {
        if (!isLoggedIn) {
            Modal.confirm({
                title: 'Đăng nhập để xem chi tiết',
                content: 'Bạn cần đăng nhập để xem chi tiết khóa học này.',
                okText: 'Đăng nhập',
                cancelText: 'Hủy',
                onOk: () => navigate(ROUTER_URL.AUTH.LOGIN),
            });
            return;
        }

        navigate(`${ROUTER_URL.CLIENT.COURSE}/${course.id}`);
    };

    const handleProgramClick = (program: RecommendationItem) => {
        if (!isLoggedIn) {
            Modal.confirm({
                title: 'Đăng nhập để xem chi tiết',
                content: 'Bạn cần đăng nhập để xem chi tiết chương trình này.',
                okText: 'Đăng nhập',
                cancelText: 'Hủy',
                onOk: () => navigate(ROUTER_URL.AUTH.LOGIN),
            });
            return;
        }

        const enrollmentData = enrolledPrograms.get(program.id);
        if (!enrollmentData) {
            Modal.confirm({
                title: 'Tham gia chương trình',
                content: `Bạn cần tham gia chương trình "${program.name}" để xem chi tiết.`,
                okText: 'Tham gia ngay',
                cancelText: 'Hủy',
                onOk: () => handleEnrollProgram(program.id),
            });
            return;
        }

        navigate(`${ROUTER_URL.CLIENT.PROGRAM}/${program.id}`);
    };

    const isEnrolled = (programId: string) => {
        const enrollmentData = enrolledPrograms.get(programId);
        // Consider enrolled if program exists in enrollment list
        // joinDate might not be set immediately after enrollment
        return !!enrollmentData;
    };

    const getEnrollmentData = (programId: string) => {
        return enrolledPrograms.get(programId);
    };

    const riskLevel = calculateRiskLevel(surveyResult);
    const riskInfo = getRiskLevelInfo(riskLevel);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="mb-6">
                        <CheckCircleOutlined className="text-6xl text-green-500 mb-4" />
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Kết quả khảo sát
                        </h1>
                        <p className="text-xl text-gray-600">
                            Cảm ơn bạn đã hoàn thành bài khảo sát. Dưới đây là kết quả và khuyến nghị dành cho bạn.
                        </p>
                    </div>

                    {/* Risk Level Card */}
                    <div className={`max-w-2xl mx-auto p-8 rounded-2xl shadow-lg ${riskInfo.bgColor} border-2 border-current ${riskInfo.color}`}>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">Mức độ nguy cơ</h2>
                            <div className="text-4xl font-bold mb-4">{riskInfo.label}</div>
                            <p className="text-lg mb-6">{riskInfo.description}</p>

                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={onBack}
                                    className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Quay lại danh sách
                                </button>
                                <button
                                    onClick={onStartNewAssessment}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Làm khảo sát khác
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommendations Section */}
                <div className="mb-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Khuyến nghị dành cho bạn
                        </h2>
                        <p className="text-lg text-gray-600">
                            Dựa trên kết quả khảo sát, chúng tôi đề xuất các khóa học và chương trình phù hợp
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <LoadingOutlined className="text-4xl text-blue-600" />
                            <span className="ml-3 text-lg text-gray-600">Đang tải đề xuất...</span>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <ExclamationCircleOutlined className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={fetchRecommendations}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Thử lại
                            </button>
                        </div>
                    ) : recommendations.length === 0 ? (
                        <div className="text-center py-12">
                            <InfoCircleOutlined className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Không có đề xuất phù hợp
                            </h3>
                            <p className="text-gray-600">
                                Hiện tại chưa có khóa học hoặc chương trình phù hợp với mức độ nguy cơ của bạn.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendations.map((item) => {
                                const isUserEnrolled = item.type === 'program' ? isEnrolled(item.id) : false;
                                const enrollmentData = item.type === 'program' ? getEnrollmentData(item.id) : null;

                                return (
                                    <div
                                        key={`${item.type}-${item.id}`}
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                                        onClick={() => item.type === 'course' ? handleCourseClick(item) : handleProgramClick(item)}
                                    >
                                        {/* Image */}
                                        <div className="relative h-48 bg-gray-200 overflow-hidden">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    style={{
                                                        filter: !isLoggedIn || (item.type === 'program' && !isUserEnrolled) ? 'brightness(0.7)' : 'none'
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                                    {item.type === 'course' ? (
                                                        <BookOutlined className="h-16 w-16 text-blue-400" />
                                                    ) : (
                                                        <TeamOutlined className="h-16 w-16 text-purple-400" />
                                                    )}
                                                </div>
                                            )}

                                            {/* Overlay Icons */}
                                            {item.type === 'program' && item.programVidUrl && isLoggedIn && isUserEnrolled && (
                                                <PlayCircleOutlined
                                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl drop-shadow-lg"
                                                />
                                            )}
                                            {(!isLoggedIn || (item.type === 'program' && !isUserEnrolled)) && (
                                                <LockOutlined
                                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl drop-shadow-lg"
                                                />
                                            )}
                                            {isLoggedIn && item.type === 'program' && isUserEnrolled && (
                                                <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                                                    <CheckCircleOutlined className="text-white text-sm" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <div className="flex items-center mb-3">
                                                {item.type === 'course' ? (
                                                    <BookOutlined className="h-5 w-5 text-blue-600 mr-2" />
                                                ) : (
                                                    <TeamOutlined className="h-5 w-5 text-purple-600 mr-2" />
                                                )}
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.type === 'course'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {item.type === 'course' ? 'Khóa học' : 'Chương trình'}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                                {item.description}
                                            </p>

                                            {/* Details */}
                                            <div className="space-y-2 mb-4">
                                                {item.duration && (
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <ClockCircleOutlined className="h-4 w-4 mr-2" />
                                                        {item.duration}
                                                    </div>
                                                )}
                                                {item.location && (
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <InfoCircleOutlined className="h-4 w-4 mr-2" />
                                                        {item.location}
                                                    </div>
                                                )}
                                                {item.price !== undefined && (
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <span className="font-medium text-green-600">
                                                            {item.price === 0 ? 'Miễn phí' : `${item.price.toLocaleString()} VNĐ`}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Button */}
                                            {item.type === 'program' && isLoggedIn && isUserEnrolled ? (
                                                <div className="text-center">
                                                    <div className="text-green-600 text-sm font-medium mb-1">
                                                        <CheckCircleOutlined className="mr-1" />
                                                        Đã tham gia
                                                    </div>
                                                    {enrollmentData?.joinDate && (
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(enrollmentData.joinDate).toLocaleDateString('vi-VN')}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (item.type === 'program') {
                                                            handleEnrollProgram(item.id);
                                                        } else {
                                                            handleCourseClick(item);
                                                        }
                                                    }}
                                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium flex items-center justify-center group"
                                                    disabled={enrolling === item.id}
                                                >
                                                    {enrolling === item.id ? (
                                                        <>
                                                            <LoadingOutlined className="mr-2" />
                                                            Đang xử lý...
                                                        </>
                                                    ) : (
                                                        <>
                                                            {item.type === 'course' ? 'Xem chi tiết' : 'Tham gia chương trình'}
                                                            <ArrowRightOutlined className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Additional Resources */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Tài nguyên bổ sung
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOutlined className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Tài liệu giáo dục
                            </h3>
                            <p className="text-gray-600">
                                Truy cập thư viện tài liệu về phòng chống ma túy và lối sống lành mạnh.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TeamOutlined className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Tư vấn chuyên môn
                            </h3>
                            <p className="text-gray-600">
                                Kết nối với các chuyên gia tư vấn để được hỗ trợ cá nhân.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircleOutlined className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Theo dõi tiến độ
                            </h3>
                            <p className="text-gray-600">
                                Theo dõi sự tiến bộ của bạn qua các bài đánh giá định kỳ.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 