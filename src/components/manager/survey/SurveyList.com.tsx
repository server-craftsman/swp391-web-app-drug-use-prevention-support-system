import React, { useEffect, useState } from "react";
import { Table, Input, Select, Button, Tag, message, Space, Card, Statistic, Row, Col, Tooltip, Badge } from "antd";
import { EditOutlined, PlusOutlined, EyeOutlined, SearchOutlined, FilterOutlined, BarChartOutlined, ClockCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { SurveyResponse } from "../../../types/survey/Survey.res.type";
import { SurveyService } from "../../../services/survey/survey.service";
import { SurveyType } from "../../../app/enums/surveyType.enum";
import SurveyCreateModal from "./Create.com";
import SurveyUpdateModal from "./Update.com";
import SurveyDeleteButton from "./Delete.com";

interface Props {
    pageSizeDefault?: number;
    onSelectSurvey?: (survey: SurveyResponse) => void;
    onLoadedSurveys?: (surveys: SurveyResponse[]) => void;
}

const SurveyList: React.FC<Props> = ({ pageSizeDefault = 10, onSelectSurvey, onLoadedSurveys }) => {
    const [data, setData] = useState<SurveyResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeDefault);
    const [total, setTotal] = useState(0);
    const [filterByName, setFilterByName] = useState("");
    const [surveyTypeFilter, setSurveyTypeFilter] = useState<SurveyType | undefined>();

    /* ----------------- External modal state ------------------- */
    const [createOpen, setCreateOpen] = useState(false);
    const [updateTarget, setUpdateTarget] = useState<SurveyResponse | null>(null);

    const openCreate = () => setCreateOpen(true);
    const openEdit = (record: SurveyResponse) => setUpdateTarget(record);

    const fetchData = async () => {
        try {
            setLoading(true);
            console.log("Fetching surveys with params:", { pageNumber, pageSize, filterByName });

            const res = await SurveyService.getAllSurveys({
                pageNumber,
                pageSize,
                filterByName,
            } as any);

            console.log("Survey API response:", res);

            const resp: any = res?.data ?? {};
            const list = resp.data ?? [];
            const totalCount = resp.totalCount ?? list.length;

            console.log("Processed survey data:", { list: list.length, totalCount });

            setData(list);
            setTotal(totalCount);

            // Notify parent with the latest list
            onLoadedSurveys?.(list);
        } catch (error) {
            console.error("Error fetching surveys:", error);
            message.error("Không thể tải danh sách khảo sát");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pageNumber, pageSize]);

    const handleSearchClick = () => {
        if (pageNumber !== 1) {
            setPageNumber(1);
        } else {
            fetchData();
        }
    };

    const getSurveyTypeIcon = (type: SurveyType) => {
        const iconMap = {
            [SurveyType.RISK_ASSESSMENT]: "⚠️",
            [SurveyType.PRE_FEEDBACK]: "🚀",
            [SurveyType.POST_FEEDBACK]: "✅",
        };
        return iconMap[type] || "📊";
    };

    const getSurveyTypeColor = (type: SurveyType) => {
        const colorMap = {
            [SurveyType.RISK_ASSESSMENT]: "orange",
            [SurveyType.PRE_FEEDBACK]: "green",
            [SurveyType.POST_FEEDBACK]: "purple",
        };
        return colorMap[type] || "default";
    };

    const getSurveyTypeDisplayName = (type: SurveyType) => {
        const nameMap = {
            [SurveyType.RISK_ASSESSMENT]: "Đánh giá Rủi ro",
            [SurveyType.PRE_FEEDBACK]: "Phản hồi Trước",
            [SurveyType.POST_FEEDBACK]: "Phản hồi Sau",
        };
        return nameMap[type] || type;
    };

    const columns: ColumnsType<SurveyResponse> = [
        {
            title: <span className="font-semibold text-gray-700">Khảo sát</span>,
            dataIndex: "name",
            key: "name",
            render: (name: string, record: SurveyResponse) => (
                <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 truncate">{name}</div>
                        <div className="text-sm text-gray-500 mt-1">
                            <ClockCircleOutlined className="mr-1" />
                            {record.estimateTime || 5} phút
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: <span className="font-semibold text-gray-700">Loại</span>,
            dataIndex: "surveyType",
            key: "surveyType",
            render: (val: SurveyType) => (
                <Tag
                    color={getSurveyTypeColor(val)}
                    className="px-3 py-1 rounded-full font-medium border-0"
                    style={{ margin: 0 }}
                >
                    {getSurveyTypeDisplayName(val)}
                </Tag>
            ),
        },
        {
            title: <span className="font-semibold text-gray-700">Trạng thái</span>,
            key: "status",
            render: () => (
                <Badge
                    status="processing"
                    text="Hoạt động"
                    className="text-green-600 font-medium"
                />
            ),
        },
        {
            title: <span className="font-semibold text-gray-700">Hành động</span>,
            key: "action",
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectSurvey?.(record);
                            }}
                            className="hover:bg-blue-50 hover:text-blue-600 border-0 shadow-sm transition-all duration-200"
                            size="large"
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                openEdit(record);
                            }}
                            className="hover:bg-green-50 hover:text-green-600 border-0 shadow-sm transition-all duration-200"
                            size="large"
                        />
                    </Tooltip>
                    <SurveyDeleteButton
                        survey={record}
                        onSuccess={fetchData}
                        disabled={loading}
                        className="text-red-500 hover:text-red-700"
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                            <BarChartOutlined className="text-white text-xl" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Quản lý Khảo sát</h2>
                            <p className="text-gray-600">Tạo và quản lý các cuộc khảo sát của tổ chức</p>
                        </div>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={openCreate}
                        size="large"
                        className="bg-primary hover:bg-primary-dark border-0 shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-6 rounded-xl"
                    >
                        Tạo khảo sát mới
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <Row gutter={16}>
                <Col span={8}>
                    <Card className="text-center border-0 shadow-sm hover:shadow-md transition-all duration-200">
                        <Statistic
                            title="Tổng khảo sát"
                            value={total}
                            valueStyle={{ color: '#3f87f5' }}
                            prefix={<BarChartOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Search and Filter Section */}
            <Card className="border-0 shadow-sm">
                <div className="flex gap-4 items-center flex-wrap">
                    <div className="flex-1 max-w-md">
                        <Input
                            placeholder="Tìm kiếm theo tên khảo sát..."
                            value={filterByName}
                            onChange={(e) => setFilterByName(e.target.value)}
                            prefix={<SearchOutlined className="text-gray-400" />}
                            className="h-12 rounded-xl border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-200"
                            size="large"
                        />
                    </div>
                    <Select
                        allowClear
                        placeholder="Loại khảo sát"
                        value={surveyTypeFilter}
                        className="w-48 h-13 mt-0 rounded-xl"
                        onChange={(val) => setSurveyTypeFilter(val as any)}
                        optionLabelProp="label"
                        size="large"
                    >
                        {Object.values(SurveyType).map((t) => (
                            <Select.Option
                                key={t}
                                value={t}
                                label={
                                    <div className="flex items-center gap-2">
                                        <span>{getSurveyTypeIcon(t)}</span>
                                        <span>{t}</span>
                                    </div>
                                }
                            >
                                <div className="flex items-center gap-2">
                                    <span>{getSurveyTypeIcon(t)}</span>
                                    <span>{t}</span>
                                </div>
                            </Select.Option>
                        ))}
                    </Select>
                    <Button
                        type="primary"
                        icon={<FilterOutlined />}
                        onClick={handleSearchClick}
                        size="large"
                        className="bg-primary hover:bg-primary-dark border-0 shadow-sm hover:shadow-md transition-all duration-200 h-12 px-6 rounded-xl"
                    >
                        Lọc
                    </Button>
                </div>
            </Card>

            {/* Table Section */}
            <Card className="border-0 shadow-sm">
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    onRow={(record) => ({
                        onClick: () => onSelectSurvey?.(record),
                        className: "hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                    })}
                    pagination={{
                        current: pageNumber,
                        pageSize,
                        total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => (
                            <span className="text-sm text-gray-600">
                                Hiển thị <span className="font-semibold">{range[0]}-{range[1]}</span> trong tổng số <span className="font-semibold">{total}</span> khảo sát
                            </span>
                        ),
                        onChange: (p, s) => {
                            setPageNumber(p);
                            setPageSize(s);
                        },
                        className: "mt-6",
                    }}
                    className="custom-table"
                />
            </Card>

            {/* Modals */}
            <SurveyCreateModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSuccess={fetchData}
            />
            <SurveyUpdateModal
                open={!!updateTarget}
                initialData={updateTarget}
                onClose={() => setUpdateTarget(null)}
                onSuccess={fetchData}
            />
        </div>
    );
};

export default SurveyList;