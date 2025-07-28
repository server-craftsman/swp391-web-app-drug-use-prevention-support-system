import React from "react";
import { Row, Col, Card, Image, Typography, Spin, Pagination, Select, Button, Modal, Tag } from "antd";
import { PlayCircleOutlined, CheckCircleOutlined, LockOutlined, CalendarOutlined, UserOutlined, TagOutlined, FireOutlined, HeartOutlined, BookOutlined, MessageOutlined } from "@ant-design/icons";
import { ProgramService } from "../../../services/program/program.service";
import type { Program, ProgramEnrollment } from "../../../types/program/Program.type";
import { helpers } from "../../../utils";
import { debugAPI } from "../../../utils/debug";
import { useNavigate } from "react-router-dom";
import { ProgramType } from "../../../app/enums/programType.enum";
import { RiskLevel } from "../../../app/enums/riskLevel.enum";
import { ROUTER_URL } from "../../../consts/router.path.const";
import CustomSearch from "../../../components/common/CustomSearch.com";
import type { PaginatedProgramResponse } from "../../../types/program/Program.res.type";

const { Meta } = Card;
const { Title, Paragraph } = Typography;

const PAGE_SIZE_DEFAULT = 8;

const ClientProgramPage: React.FC = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = React.useState<Program[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [enrolling, setEnrolling] = React.useState<string | null>(null);
  const [enrolledPrograms, setEnrolledPrograms] = React.useState<Map<string, ProgramEnrollment>>(new Map());
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(PAGE_SIZE_DEFAULT);
  const [total, setTotal] = React.useState(0);

  const [searchName, setSearchName] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<ProgramType | undefined>();
  const [riskFilter, setRiskFilter] = React.useState<RiskLevel | undefined>();

  // Check if user is logged in
  const userInfo = localStorage.getItem("userInfo");
  const isLoggedIn = !!userInfo;

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await ProgramService.getAllPrograms({
        pageNumber,
        pageSize,
        filterByName: searchName,
      } as any);
      const resp: PaginatedProgramResponse = res?.data ?? {};
      const list: Program[] = resp.data ?? [];
      // Client-side filters
      const filtered = list.filter(p => {
        const matchType = typeFilter ? p.type === typeFilter : true;
        const matchRisk = riskFilter ? p.riskLevel === riskFilter : true;
        return matchType && matchRisk;
      });
      const totalCount = resp.totalCount ?? filtered.length;
      setPrograms(filtered);
      setTotal(totalCount);
    } catch (err) {
      helpers.notificationMessage("Không thể tải danh sách chương trình", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's enrolled programs with joinDate
  const fetchEnrolledPrograms = async () => {
    if (!isLoggedIn) return;

    try {
      const res = await ProgramService.programEnrollments();
      debugAPI.logProgramEnrollments(res); // Debug log

      if (res?.data) {
        const enrolledMap = new Map<string, ProgramEnrollment>();
        res.data.data.forEach((program: ProgramEnrollment) => {
          const key = program.programId || program.id;
          console.log("Processing enrollment:", { key, program }); // Debug log

          if (key) {
            // Consider enrolled if program exists in enrollment list
            // joinDate might not be set immediately after enrollment
            enrolledMap.set(key, program);
          }
        });
        setEnrolledPrograms(enrolledMap);
        console.log("Final enrolled map:", enrolledMap); // Debug log
      }
    } catch (err) {
      console.error("Error fetching enrolled programs:", err);
    }
  };

  React.useEffect(() => {
    fetchPrograms();
    fetchEnrolledPrograms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, pageSize, typeFilter, riskFilter, searchName]);

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
      helpers.notificationMessage("Đã tham gia chương trình thành công!", "success");

      // Refresh enrolled programs to get the latest joinDate
      await fetchEnrolledPrograms();
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Không thể tham gia chương trình";
      helpers.notificationMessage(errorMsg, "error");
    } finally {
      setEnrolling(null);
    }
  };

  const handleProgramClick = (program: Program) => {
    if (!program.id) return;

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
        onOk: () => handleEnrollProgram(program.id!),
      });
      return;
    }

    navigate(`${ROUTER_URL.CLIENT.PROGRAM}/${program.id}`);
  };

  const isEnrolled = (programId: string | undefined) => {
    if (!programId) return false;
    const enrollmentData = enrolledPrograms.get(programId);
    // Consider enrolled if program exists in enrollment list
    // joinDate might not be set immediately after enrollment
    return !!enrollmentData;
  };

  const getEnrollmentData = (programId: string | undefined): ProgramEnrollment | undefined => {
    if (!programId) return undefined;
    return enrolledPrograms.get(programId);
  };

  const getProgramType = (type: ProgramType) => {
    switch (type) {
      case ProgramType.COMMUNICATION:
        return "Giao lưu";
      case ProgramType.TRAINING:
        return "Giáo dục";
      case ProgramType.COUNSELING:
        return "Tư vấn";
    }
  }

  const getRiskLevel = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW:
        return "Thấp";
      case RiskLevel.MEDIUM:
        return "Trung bình";
      case RiskLevel.HIGH:
        return "Cao";
      case RiskLevel.VERY_HIGH:
        return "Rất cao";
    }
  }

  const getRiskLevelColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW:
        return "green";
      case RiskLevel.MEDIUM:
        return "orange";
      case RiskLevel.HIGH:
        return "red";
      case RiskLevel.VERY_HIGH:
        return "purple";
      default:
        return "default";
    }
  }

  const getProgramTypeColor = (type: ProgramType) => {
    switch (type) {
      case ProgramType.COMMUNICATION:
        return "blue";
      case ProgramType.TRAINING:
        return "cyan";
      case ProgramType.COUNSELING:
        return "geekblue";
      default:
        return "default";
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-48 translate-y-48 blur-3xl"></div>
        
        <div className="relative px-6 py-16 max-w-screen-xl mx-auto text-center">
          <Title level={1} className="!text-white !mb-4 !text-4xl !font-bold">
            🌟 Khám Phá Chương Trình Nổi Bật
          </Title>
          <Paragraph className="!text-white/90 !text-lg !mb-8 max-w-2xl mx-auto">
            Tham gia hành trình phát triển bản thân với các chương trình chất lượng cao, 
            được thiết kế đặc biệt để giúp bạn đạt được mục tiêu của mình.
          </Paragraph>
        </div>
      </div>

      <div className="px-6 py-8 max-w-screen-xl mx-auto">
        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:flex-1">
              <CustomSearch
                placeholder="Tìm kiếm chương trình..."
                onSearch={(value) => setSearchName(value)}
              />
            </div>
            <Select
              placeholder="📚 Loại chương trình"
              style={{ width: "100%" }}
              size="large"
              onChange={(value) => setTypeFilter(value as ProgramType)}
              allowClear
              className="min-w-[200px]"
            >
              {Object.values(ProgramType).map(t => (
                <Select.Option key={t} value={t}>
                  {t === ProgramType.COMMUNICATION ? <MessageOutlined className="mr-2" /> : null}
                  {t === ProgramType.TRAINING ? <BookOutlined className="mr-2" /> : null}
                  {t === ProgramType.COUNSELING ? <HeartOutlined className="mr-2" /> : null}
                  {getProgramType(t)}
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder="⚡ Mức độ nguy hiểm"
              style={{ width: "100%" }}
              size="large"
              onChange={(value) => setRiskFilter(value as RiskLevel)}
              allowClear
              className="min-w-[200px]"
            >
              {Object.values(RiskLevel).map(r => (
                <Select.Option key={r} value={r}>
                  {r === RiskLevel.LOW ? <CheckCircleOutlined className="mr-2 text-green-500" /> : null}
                  {r === RiskLevel.MEDIUM ? <CalendarOutlined className="mr-2 text-yellow-500" /> : null}
                  {r === RiskLevel.HIGH ? <FireOutlined className="mr-2 text-orange-500" /> : null}
                  {r === RiskLevel.VERY_HIGH ? <LockOutlined className="mr-2 text-red-500" /> : null}
                  {getRiskLevel(r)}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>

        {/* Programs Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <Spin size="large" />
              <div className="mt-4 text-gray-500">Đang tải chương trình...</div>
            </div>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {programs.map((p) => {
              if (!p.id) return null; // Skip programs without ID

              const enrollmentData = getEnrollmentData(p.id);
              const isUserEnrolled = isEnrolled(p.id);

              return (
                <Col key={p.id} xs={24} sm={12} lg={8} xl={6}>
                  <Card
                    hoverable
                    className="h-[300px] group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 program-card"
                    cover={
                      <div className="relative overflow-hidden program-cover">
                        <Image
                          src={p.programImgUrl}
                          alt={p.name}
                          preview={false}
                          className="transition-transform duration-500 group-hover:scale-110 program-image"
                          style={{
                            filter: !isLoggedIn || !isUserEnrolled ? 'brightness(0.8)' : 'none'
                          }}
                        />
                        
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Video icon */}
                        {p.programVidUrl && isLoggedIn && isUserEnrolled && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <PlayCircleOutlined className="text-white text-5xl drop-shadow-lg animate-pulse" />
                          </div>
                        )}
                        
                        {/* Lock icon */}
                        {(!isLoggedIn || !isUserEnrolled) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <LockOutlined className="text-white text-4xl drop-shadow-lg" />
                          </div>
                        )}
                        
                        {/* Enrollment badge */}
                        {isLoggedIn && isUserEnrolled && (
                          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                            <CheckCircleOutlined className="mr-1" />
                            Đã tham gia
                          </div>
                        )}

                        {/* Program tags */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          <Tag color={getProgramTypeColor(p.type ?? ProgramType.COMMUNICATION)} className="rounded-lg font-medium shadow-sm">
                            <TagOutlined className="mr-1" />
                            {getProgramType(p.type ?? ProgramType.COMMUNICATION)}
                          </Tag>
                          {p.riskLevel && (
                            <Tag color={getRiskLevelColor(p.riskLevel)} className="rounded-lg font-medium shadow-sm">
                              <FireOutlined className="mr-1" />
                              {getRiskLevel(p.riskLevel)}
                            </Tag>
                          )}
                        </div>
                      </div>
                    }
                    onClick={() => handleProgramClick(p)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="p-2 program-content">
                      <Meta
                        title={
                          <div className="mb-2">
                            <span className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                              {p.name}
                            </span>
                          </div>
                        }
                        description={
                          <div className="space-y-1 flex flex-col program-description">
                            <div
                              className="text-gray-600 text-sm line-clamp-2 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: p.description ?? "" }}
                            />
                            
                            {/* Enrollment info */}
                            {isLoggedIn && isUserEnrolled && enrollmentData?.joinDate && (
                              <div className="flex items-center text-green-600 text-xs bg-green-50 px-3 py-2 rounded-lg">
                                <CalendarOutlined className="mr-2" />
                                Tham gia: {new Date(enrollmentData.joinDate).toLocaleDateString('vi-VN')}
                              </div>
                            )}
                          </div>
                        }
                      />
                      
                      {/* Action Button */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        {isLoggedIn && isUserEnrolled ? (
                          <Button 
                            type="primary" 
                            size="large"
                            className="w-full bg-green-500 hover:bg-green-600 border-0 h-12 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <CheckCircleOutlined className="mr-2" />
                            Tiếp tục học tập
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            size="large"
                            loading={enrolling === p.id}
                            className="w-full bg-primary hover:bg-primary/80 border-0 h-12 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnrollProgram(p.id!);
                            }}
                          >
                            <UserOutlined className="mr-2" />
                            {enrolling === p.id ? 'Đang tham gia...' : 'Tham gia chương trình'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {/* Pagination */}
        {!loading && programs.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-4">
              <Pagination
                current={pageNumber}
                pageSize={pageSize}
                total={total}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) => 
                  `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} chương trình`
                }
                pageSizeOptions={["8", "16", "24", "32"]}
                onChange={(p, s) => {
                  setPageNumber(p);
                  setPageSize(s || PAGE_SIZE_DEFAULT);
                }}
                className="custom-pagination"
              />
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && programs.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <Title level={3} className="!text-gray-500 !mb-2">
              Không tìm thấy chương trình nào
            </Title>
            <Paragraph className="!text-gray-400 !mb-6">
              Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
            </Paragraph>
            <Button 
              type="primary" 
              size="large"
              onClick={() => {
                setSearchName("");
                setTypeFilter(undefined);
                setRiskFilter(undefined);
              }}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>

      <style>{`
        .custom-pagination .ant-pagination-item {
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        .custom-pagination .ant-pagination-item:hover {
          border-color: #3b82f6;
        }
        .custom-pagination .ant-pagination-item-active {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          border-color: #3b82f6;
        }
        .custom-pagination .ant-pagination-item-active a {
          color: white;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Đảm bảo kích thước đồng nhất cho các card */
        .program-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 300px;
        }
        
        .program-card .ant-card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 0;
        }
        
        .program-cover {
          height: 200px;
          position: relative;
        }
        
        .program-image {
          width: 100%;
          height: 200px !important;
          object-fit: cover;
        }
        
        .program-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .program-content .ant-card-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .program-content .ant-card-meta-detail {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .program-description {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 120px;
        }
        
        /* Đảm bảo title có chiều cao cố định */
        .program-content .ant-card-meta-title {
          min-height: 50px;
          display: flex;
          align-items: flex-start;
        }
        
        /* Đảm bảo description có chiều cao cố định */
        .program-description > div:first-child {
          min-height: 20px;
        }
      `}</style>
    </div>
  );
};

export default ClientProgramPage;
