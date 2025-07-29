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
            title: <span className="font-semibold text-gray-700">Ảnh</span>,
            dataIndex: "programImgUrl",
            key: "image",
            render: (url: string) => (
                <div className="flex justify-center">
                    <Image 
                        src={url} 
                        width={80} 
                        height={50} 
                        className="rounded-lg object-cover shadow-sm border border-gray-200"
                        placeholder={
                            <div className="w-20 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                            </div>
                        }
                    />
                </div>
            ),
            width: 120,
        },
        {
            title: <span className="font-semibold text-gray-700">Tên chương trình</span>,
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name?.localeCompare(b.name ?? "") ?? 0,
            render: (name: string) => (
                <div className="max-w-xs">
                    <p className="font-medium text-gray-800 truncate">{name}</p>
                </div>
            ),
        },
        {
            title: <span className="font-semibold text-gray-700">Địa điểm</span>,
            dataIndex: "location",
            key: "location",
            render: (location: string) => (
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{location}</span>
                </div>
            ),
        },
        {
            title: <span className="font-semibold text-gray-700">Loại</span>,
            dataIndex: "type",
            key: "type",
            render: (value: Program["type"]) => {
                const typeConfig = {
                    Communication: { color: "blue", icon: "💬", label: "Giao tiếp" },
                    Training: { color: "green", icon: "📚", label: "Đào tạo" },
                };
                const config = typeConfig[value as keyof typeof typeConfig] || { color: "purple", icon: "📋", label: value };
                return (
                    <Tag 
                        color={config.color} 
                        className="rounded-full px-3 py-1 font-medium border-0"
                        style={{ margin: 0 }}
                    >
                        <span className="mr-1">{config.icon}</span>
                        {config.label}
                    </Tag>
                );
            },
        },
        {
            title: <span className="font-semibold text-gray-700">Thời gian</span>,
            dataIndex: "startDate",
            key: "duration",
            render: (startDate: string, record) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium text-gray-700">{helpers.formatDate(new Date(startDate))}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium text-gray-700">{helpers.formatDate(new Date(record.endDate))}</span>
                    </div>
                </div>
            ),
            width: 160,
        },
        {
            title: <span className="font-semibold text-gray-700">Mức rủi ro</span>,
            dataIndex: "riskLevel",
            key: "riskLevel",
            render: (value: Program["riskLevel"]) => {
                const riskConfig = {
                    [RiskLevel.NONE]: { color: 'green', icon: '✅', label: "Không rủi ro" },
                    [RiskLevel.LOW]: { color: 'blue', icon: '🔵', label: "Thấp" },
                    [RiskLevel.MEDIUM]: { color: 'gold', icon: '🟡', label: "Trung bình" },
                    [RiskLevel.HIGH]: { color: 'orange', icon: '🟠', label: "Cao" },
                    [RiskLevel.VERY_HIGH]: { color: 'red', icon: '🔴', label: "Rất cao" },
                };
                const config = riskConfig[value as RiskLevel] || { color: 'default', icon: '⚪', label: value };
                return (
                    <Tag 
                        color={config.color} 
                        className="rounded-full px-3 py-1 font-medium border-0"
                        style={{ margin: 0 }}
                    >
                        <span className="mr-1">{config.icon}</span>
                        {config.label}
                    </Tag>
                );
            },
            width: 140,
        },
        {
            title: <span className="font-semibold text-gray-700">Hành động</span>,
            key: "actions",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="text"
                        shape="circle"
                        icon={<EyeOutlined />}
                        onClick={() => onView(record)}
                        className="hover:bg-blue-50 hover:text-blue-600 border-0 shadow-sm transition-all duration-200"
                        size="large"
                        title="Xem chi tiết"
                    />
                    <Button
                        type="text"
                        shape="circle"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                        className="hover:bg-green-50 hover:text-green-600 border-0 shadow-sm transition-all duration-200"
                        size="large"
                        title="Chỉnh sửa"
                    />
                    <Button
                        danger
                        type="text"
                        shape="circle"
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete(record)}
                        className="hover:bg-red-50 hover:text-red-600 border-0 shadow-sm transition-all duration-200"
                        size="large"
                        title="Xóa"
                    />
                </Space>
            ),
            width: 150,
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                    <div className="flex-1 max-w-md">
                        <CustomSearch
                            placeholder="Tìm kiếm theo tên chương trình..."
                            onSearch={onSearch}
                            loading={loading}
                        />
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-600">
                                Tổng cộng: <span className="font-bold text-blue-700">{total}</span> chương trình
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <Table
                    columns={columns}
                    dataSource={programs}
                    rowKey="id"
                    loading={loading}
                    className="custom-table"
                    rowClassName="hover:bg-gray-50 transition-colors duration-200"
                    pagination={{
                        total,
                        current: currentPage,
                        pageSize,
                        showSizeChanger: true,
                        onChange: onPaginationChange,
                        showQuickJumper: true,
                        showTotal: (total, range) => (
                            <span className="text-sm text-gray-600">
                                Hiển thị {range[0]}-{range[1]} trong tổng số {total} chương trình
                            </span>
                        ),
                        className: "mt-6",
                    }}
                />
            </div>
        </div>
    );
};

export default ProgramDisplay;
