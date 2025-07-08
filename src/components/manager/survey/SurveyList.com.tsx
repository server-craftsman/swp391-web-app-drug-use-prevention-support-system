import React, { useEffect, useState } from "react";
import { Table, Input, Select, Button, Tag, message, Space } from "antd";
import { EditOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { SurveyResponse } from "../../../types/survey/Survey.res.type";
import { SurveyService } from "../../../services/survey/survey.service";
import { SurveyType } from "../../../app/enums/surveyType.enum";
import SurveyCreateModal from "./Create.com";
import SurveyUpdateModal from "./Update.com";
import SurveyDeleteButton from "./Delete.com";
import { color } from "../../../utils";

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

    const columns: ColumnsType<SurveyResponse> = [
        { title: "Tên", dataIndex: "name", key: "name" },
        {
            title: "Loại",
            dataIndex: "surveyType",
            key: "surveyType",
            render: (val: SurveyType) => (
                <Tag color={color.getSurveyTypeColor(val)} style={{ fontWeight: 500 }}>
                    {val}
                </Tag>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        size="small"
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectSurvey?.(record);
                        }}
                        title="Xem chi tiết"
                    />
                    <Button
                        size="small"
                        type="text"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            openEdit(record);
                        }}
                        title="Chỉnh sửa khảo sát"
                    />
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
        <>
            <div className="flex gap-4 mb-4 items-center flex-wrap">
                <Input
                    placeholder="Tìm kiếm theo tên"
                    value={filterByName}
                    onChange={(e) => setFilterByName(e.target.value)}
                    style={{ width: 200 }}
                />
                <Select
                    allowClear
                    placeholder="Loại khảo sát"
                    value={surveyTypeFilter}
                    style={{ width: 180 }}
                    onChange={(val) => setSurveyTypeFilter(val as any)}
                    optionLabelProp="label"
                >
                    {Object.values(SurveyType).map((t) => (
                        <Select.Option
                            key={t}
                            value={t}
                            label={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Tag color={color.getSurveyTypeColor(t)} style={{ margin: 0, fontSize: '12px' }}>
                                        {t}
                                    </Tag>
                                </div>
                            }
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Tag color={color.getSurveyTypeColor(t)} style={{ margin: 0, fontSize: '12px' }}>
                                    {t}
                                </Tag>
                            </div>
                        </Select.Option>
                    ))}
                </Select>
                <Button type="primary" className="bg-primary" onClick={handleSearchClick}>
                    Lọc
                </Button>
                <Button type="primary" className="bg-primary" icon={<PlusOutlined />} onClick={openCreate}>
                    Tạo khảo sát
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                onRow={(record) => ({
                    onClick: () => onSelectSurvey?.(record),
                    style: { cursor: 'pointer' }
                })}
                pagination={{
                    current: pageNumber,
                    pageSize,
                    total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khảo sát`,
                    onChange: (p, s) => {
                        setPageNumber(p);
                        setPageSize(s);
                    },
                }}
                size="small"
            />
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
        </>
    );
};

export default SurveyList; 