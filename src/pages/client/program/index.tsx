import React from "react";
import { Row, Col, Card, Image, Typography, Spin, Pagination, Select, Button, message, Modal } from "antd";
import { PlayCircleOutlined, CheckCircleOutlined, LockOutlined } from "@ant-design/icons";
import { ProgramService } from "../../../services/program/program.service";
import type { Program } from "../../../types/program/Program.type";
import { helpers } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { ProgramType } from "../../../app/enums/programType.enum";
import { RiskLevel } from "../../../app/enums/riskLevel.enum";
import { ROUTER_URL } from "../../../consts/router.path.const";
import CustomSearch from "../../../components/common/CustomSearch.com";

const { Meta } = Card;
const { Title, Paragraph } = Typography;

const PAGE_SIZE_DEFAULT = 8;

const ClientProgramPage: React.FC = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = React.useState<Program[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [enrolling, setEnrolling] = React.useState<string | null>(null);
  const [enrolledPrograms, setEnrolledPrograms] = React.useState<Set<string>>(new Set());
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
      const resp: any = res?.data ?? {};
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

  // Fetch user's enrolled programs
  const fetchEnrolledPrograms = async () => {
    if (!isLoggedIn) return;

    try {
      const res = await ProgramService.programEnrollments();
      if (res?.data?.data) {
        const enrolledIds = new Set(
          res.data.data
            .map((p: Program) => p.id)
            .filter((id): id is string => !!id)
        );
        setEnrolledPrograms(enrolledIds);
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
      message.success("Đã tham gia chương trình thành công!");
      setEnrolledPrograms(prev => new Set([...prev, programId]));
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Không thể tham gia chương trình";
      message.error(errorMsg);
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

    if (!enrolledPrograms.has(program.id)) {
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
    return programId ? enrolledPrograms.has(programId) : false;
  };

  return (
    <div className="px-6 py-8 max-w-screen-xl mx-auto">
      <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
        Khám phá Chương Trình Nổi Bật
      </Title>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 mb-4">
        <CustomSearch
          placeholder="Tìm kiếm chương trình"
          onSearch={(value) => setSearchName(value)}
        />
        <Select
          placeholder="Loại chương trình"
          style={{ width: "100%" }}
          onChange={(value) => setTypeFilter(value as ProgramType)}
          allowClear
        >
          {Object.values(ProgramType).map(t => (
            <Select.Option key={t} value={t}>{t}</Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Mức độ nguy hiểm"
          style={{ width: "100%" }}
          onChange={(value) => setRiskFilter(value as RiskLevel)}
          allowClear
        >
          {Object.values(RiskLevel).map(r => (
            <Select.Option key={r} value={r}>{r}</Select.Option>
          ))}
        </Select>
      </div>
      {loading ? (
        <Spin size="large" className="flex justify-center items-center py-20" />
      ) : (
        <Row gutter={[24, 24]}>
          {programs.map((p) => {
            if (!p.id) return null; // Skip programs without ID

            return (
              <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable={isLoggedIn && isEnrolled(p.id)}
                  cover={
                    <div style={{ position: "relative" }}>
                      <Image
                        src={p.programImgUrl}
                        alt={p.name}
                        preview={false}
                        style={{
                          height: 200,
                          objectFit: "cover",
                          filter: !isLoggedIn || !isEnrolled(p.id) ? 'brightness(0.7)' : 'none'
                        }}
                      />
                      {p.programVidUrl && isLoggedIn && isEnrolled(p.id) && (
                        <PlayCircleOutlined
                          style={{
                            position: "absolute",
                            fontSize: 48,
                            color: "#fff",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            textShadow: "0 0 8px rgba(0,0,0,0.6)",
                          }}
                        />
                      )}
                      {(!isLoggedIn || !isEnrolled(p.id)) && (
                        <LockOutlined
                          style={{
                            position: "absolute",
                            fontSize: 48,
                            color: "#fff",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            textShadow: "0 0 8px rgba(0,0,0,0.6)",
                          }}
                        />
                      )}
                      {isLoggedIn && isEnrolled(p.id) && (
                        <div style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "#52c41a",
                          borderRadius: "50%",
                          padding: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <CheckCircleOutlined style={{ color: "#fff", fontSize: 16 }} />
                        </div>
                      )}
                    </div>
                  }
                  onClick={() => handleProgramClick(p)}
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    cursor: 'pointer'
                  }}
                  actions={[
                    isLoggedIn && isEnrolled(p.id) ? (
                      <Button type="link" style={{ color: "#52c41a" }}>
                        <CheckCircleOutlined /> Đã tham gia
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        className="w-full bg-primary hover:bg-primary/35"
                        loading={enrolling === p.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnrollProgram(p.id!);
                        }}
                      >
                        {enrolling === p.id ? 'Đang tham gia...' : 'Tham gia chương trình'}
                      </Button>
                    )
                  ]}
                >
                  <Meta
                    title={<span style={{ fontWeight: 600 }}>{p.name}</span>}
                    description={
                      <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                        <div
                          className="line-clamp-2"
                          style={{ fontSize: 14, lineHeight: 1.5 }}
                          dangerouslySetInnerHTML={{ __html: p.description ?? "" }}
                        />
                      </Paragraph>
                    }
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <div className="flex justify-center mt-8">
        <Pagination
          current={pageNumber}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          showQuickJumper
          pageSizeOptions={["8", "16", "24", "32"]}
          onChange={(p, s) => {
            setPageNumber(p);
            setPageSize(s || PAGE_SIZE_DEFAULT);
          }}
        />
      </div>
    </div>
  );
};

export default ClientProgramPage;
