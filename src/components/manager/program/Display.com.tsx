import React from "react";
import { Table, Image, Button, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { Program } from "../../../types/program/Program.type";
import { helpers } from "../../../utils";
import CustomSearch from "../../common/CustomSearch.com";
import { RiskLevel } from "../../../app/enums/riskLevel.enum";

interface DisplayProps {
    programs: Program[];
    loading: boolean;
    total: number;
    currentPage: number;
    pageSize: number;
    onPaginationChange: (page: number, pageSize: number) => void;
    onView: (program: Program) => void;
    onEdit: (program: Program) => void;
    onDelete: (program: Program) => void;
    onSearch: (keyword: string) => void;
}

const ProgramDisplay: React.FC<DisplayProps> = ({
    programs,
    loading,
    total,
    currentPage,
    pageSize,
    onPaginationChange,
    onView,
    onEdit,
    onDelete,
    onSearch,
}) => {
    const columns: ColumnsType<Program> = [
        {
            title: "Ảnh",
            dataIndex: "programImgUrl",
            key: "image",
            render: (url: string) => <Image src={url} width={80} height={50} />,
            width: 120,
        },
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name?.localeCompare(b.name ?? "") ?? 0,
        },
        {
            title: "Địa điểm",
            dataIndex: "location",
            key: "location",
        },
        {
            title: "Loại",
            dataIndex: "type",
            key: "type",
            render: (value: Program["type"]) => {
                const colorMap: Record<string, string> = {
                    Communication: "blue",
                    Training: "green",
                };
                return <Tag color={colorMap[value ?? ""] || "purple"}>{value}</Tag>;
            },
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "startDate",
            key: "startDate",
            render: (value: string) => helpers.formatDate(new Date(value)),
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "endDate",
            key: "endDate",
            render: (value: string) => helpers.formatDate(new Date(value)),
        },
        {
            title: "Mức rủi ro",
            dataIndex: "riskLevel",
            key: "riskLevel",
            render: (value: Program["riskLevel"]) => {
                const colorMap: Record<RiskLevel, string> = {
                    [RiskLevel.NONE]: 'green',
                    [RiskLevel.LOW]: 'blue',
                    [RiskLevel.MEDIUM]: 'gold',
                    [RiskLevel.HIGH]: 'orange',
                    [RiskLevel.VERY_HIGH]: 'red',
                } as any;
                const riskLabels: Record<RiskLevel, string> = {
                    [RiskLevel.NONE]: "Không",
                    [RiskLevel.LOW]: "Thấp",
                    [RiskLevel.MEDIUM]: "Trung bình",
                    [RiskLevel.HIGH]: "Cao",
                    [RiskLevel.VERY_HIGH]: "Rất cao",
                };
                return <Tag color={colorMap[value as RiskLevel] || 'default'}>{riskLabels[value as RiskLevel] || value}</Tag>;
            },
            width: 120,
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button icon={<EyeOutlined />} onClick={() => onView(record)} />
                    <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
                    <Button danger icon={<DeleteOutlined />} onClick={() => onDelete(record)} />
                </Space>
            ),
            width: 150,
        },
    ];

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <CustomSearch
                    placeholder="Tìm kiếm theo tên chương trình..."
                    onSearch={onSearch}
                    loading={loading}
                />
                <div className="text-sm text-gray-500">
                    Tổng cộng: <span className="font-semibold text-blue-600">{total}</span> chương trình
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={programs}
                rowKey="id"
                loading={loading}
                pagination={{
                    total,
                    current: currentPage,
                    pageSize,
                    showSizeChanger: true,
                    onChange: onPaginationChange,
                }}
            />
        </>
    );
};

export default ProgramDisplay;
