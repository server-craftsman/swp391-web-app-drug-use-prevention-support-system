import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../../../consts/router.path.const";
import { Button, Space, Table, Tag, Tooltip, Select, DatePicker, Avatar, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Appointment } from "../../../types/appointment/Appointment.res.type";
import { AppointmentStatus } from "../../../app/enums/appointmentStatus.enum";
import { ConsultantService } from "../../../services/consultant/consultant.service";
import { AppointmentService } from "../../../services/appointment/appointment.service";
import { UserRole } from "../../../app/enums";
import { helpers } from "../../../utils";
import dayjs from "dayjs";
import { CloseCircleOutlined, EyeOutlined } from "@ant-design/icons";

interface DisplayProps {
    appointments: Appointment[];
    loading: boolean;
    total: number;
    currentPage: number;
    pageSize: number;
    onPaginationChange: (page: number, pageSize: number) => void;
    onFilterChange: (status?: AppointmentStatus | 'ALL', fromDate?: string, toDate?: string) => void;
    onRefresh: () => void;
}

interface ConsultantOption {
    id: string;
    userId?: string;
    fullName?: string;
    name?: string;
    email?: string;
    profilePicUrl?: string;
}

const AppointmentDisplay: React.FC<DisplayProps> = ({
    appointments,
    loading,
    total,
    currentPage,
    pageSize,
    onPaginationChange,
    onFilterChange,
    onRefresh,
}) => {
    const navigate = useNavigate();
    const statusColorMap: Record<string, string> = {
        [AppointmentStatus.PENDING]: "orange",
        [AppointmentStatus.CONFIRMED]: "blue",
        [AppointmentStatus.ASSIGNED]: "purple",
        [AppointmentStatus.PROCESSING]: "cyan",
        [AppointmentStatus.COMPLETED]: "green",
        [AppointmentStatus.CANCELLED]: "red",
    };

    const statusViMap: Record<string, string> = {
        [AppointmentStatus.PENDING]: "Đang chờ",
        [AppointmentStatus.CONFIRMED]: "Đã xác nhận",
        [AppointmentStatus.ASSIGNED]: "Đã được giao",
        [AppointmentStatus.PROCESSING]: "Đang xử lý",
        [AppointmentStatus.COMPLETED]: "Đã hoàn thành",
        [AppointmentStatus.CANCELLED]: "Đã hủy",
    };

    const role = React.useMemo(() => localStorage.getItem("role") || UserRole.CUSTOMER, []);

    const [consultants, setConsultants] = React.useState<ConsultantOption[]>([]);

    React.useEffect(() => {
        if (role === UserRole.MANAGER) {
            ConsultantService.getAllConsultants({ PageNumber: 1, PageSize: 1000 })
                .then((res: any) => {
                    /* API trả về fullName & userId, chuẩn hoá thành object có id, userId, fullName */
                    const apiList = res?.data?.data ?? [];
                    const list = apiList.map((c: any) => ({
                        id: c.id,
                        userId: c.userId,
                        name: c.fullName ?? c.name ?? "",
                        fullName: c.fullName,
                        email: c.email,
                        profilePicUrl: c.profilePicUrl,
                    })) as ConsultantOption[];
                    setConsultants(list);
                })
                .catch(() => helpers.notificationMessage("Không thể tải danh sách tư vấn viên", "error"));
        }
    }, [role]);

    const handleChangeStatus = async (appointmentId: string, newStatus: AppointmentStatus) => {
        try {
            await AppointmentService.changeStatus({ appointmentId, newStatus });
            helpers.notificationMessage("Cập nhật trạng thái thành công", "success");
            onRefresh();
        } catch (err) {
            helpers.notificationMessage("Cập nhật trạng thái thất bại", "error");
        }
    };

    const handleAssignConsultant = async (appointmentId: string, consultantUserId: string) => {
        try {
            await AppointmentService.assignConsultant({ appointmentId, consultantUserId });
            helpers.notificationMessage("Gán tư vấn viên thành công", "success");
            onRefresh();
        } catch (err) {
            helpers.notificationMessage("Gán tư vấn viên thất bại", "error");
        }
    };

    const handleCancel = async (record: Appointment) => {
        try {
            await AppointmentService.cancelAppointment(record.id);
            helpers.notificationMessage("Đã hủy lịch hẹn", "success");
            onRefresh();
        } catch (err) {
            helpers.notificationMessage("Hủy lịch hẹn thất bại", "error");
        }
    };

    const { RangePicker } = DatePicker;
    const [statusFilter, setStatusFilter] = React.useState<'ALL' | AppointmentStatus>('ALL');
    const [dateRange, setDateRange] = React.useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

    const handleApplyFilter = () => {
        if (dateRange && dateRange[0].isAfter(dateRange[1])) {
            helpers.notificationMessage('Ngày bắt đầu phải trước ngày kết thúc', 'error');
            return;
        }
        onFilterChange(
            statusFilter === 'ALL' ? undefined : statusFilter,
            dateRange ? dateRange[0].format('YYYY-MM-DD') : undefined,
            dateRange ? dateRange[1].format('YYYY-MM-DD') : undefined
        );
    };

    const handleClearFilter = () => {
        setStatusFilter('ALL');
        setDateRange(null);
        onFilterChange(undefined, undefined, undefined);
    };

    const isFinalStatus = (st: AppointmentStatus | string) => [
        AppointmentStatus.COMPLETED,
        AppointmentStatus.CANCELLED,
    ].includes(st as AppointmentStatus);

    const handleRowClick = (record: Appointment) => {
        let detailUrl: string;
        
        if (role === UserRole.MANAGER) {
            detailUrl = ROUTER_URL.MANAGER.SCHEDULE_DETAIL.replace(":appointmentId", record.id);
        } else if (role === UserRole.CUSTOMER) {
            detailUrl = ROUTER_URL.CUSTOMER.APPOINTMENT_DETAIL.replace(":appointmentId", record.id);
        } else {
            detailUrl = ROUTER_URL.CONSULTANT.APPOINTMENT_DETAIL.replace(":appointmentId", record.id);
        }
            
        navigate(detailUrl, { state: { appointment: record } });
    };

    const columns: ColumnsType<Appointment> = [
        {
            title: <span className="font-semibold text-gray-700">Khách hàng</span>,
            dataIndex: "name",
            key: "name",
            render: (name: string) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {name?.charAt(0)?.toUpperCase() || 'K'}
                    </div>
                    <span className="font-medium text-gray-800">{name}</span>
                </div>
            ),
        },
        {
            title: <span className="font-semibold text-gray-700">Thời gian hẹn</span>,
            dataIndex: "appointmentTime",
            key: "appointmentTime",
            render: (value: string) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{dayjs(value).format("DD/MM/YYYY")}</span>
                    <span className="text-sm text-gray-500">{dayjs(value).format("HH:mm")}</span>
                </div>
            ),
        },
        {
            title: <span className="font-semibold text-gray-700">Tư vấn viên</span>,
            dataIndex: "consultant",
            key: "consultant",
            render: (consultant, record) => {
                if (role === UserRole.MANAGER && !isFinalStatus(record.status)) {
                    return (
                        <Select
                            optionLabelProp="label"
                            placeholder="Chọn tư vấn viên"
                            value={consultant?.id}
                            style={{ width: 240 }}
                            className="rounded-lg"
                            onChange={(selectedId) => {
                                const selected = consultants.find(c => c.id === selectedId);
                                if (selected) {
                                    handleAssignConsultant(record.id, selected.id ?? selected.userId ?? "");
                                }
                            }}
                        >
                            {consultants.map((c) => (
                                <Select.Option key={c.id} value={c.id} label={c.fullName ?? c.name}>
                                    <Space>
                                        <Avatar 
                                            size="small" 
                                            src={c.profilePicUrl}
                                            className="border-2 border-white shadow-sm"
                                        />
                                        <div>
                                            <div className="font-medium">{c.fullName ?? c.name}</div>
                                            <div style={{ fontSize: 12, color: '#888' }}>{c.email}</div>
                                        </div>
                                    </Space>
                                </Select.Option>
                            ))}
                        </Select>
                    );
                }
                const displayName = (consultant as any)?.fullName || (consultant as any)?.name;
                return displayName ? (
                    <div className="flex items-center gap-2">
                        <Avatar 
                            size="small" 
                            src={(consultant as any)?.profilePicUrl}
                            className="border-2 border-white shadow-sm"
                        />
                        <span className="font-medium text-gray-800">{displayName}</span>
                    </div>
                ) : (
                    <Tag 
                        color="orange" 
                        className="rounded-full px-3 py-1 font-medium border-0 bg-orange-100 text-orange-700"
                    >
                        Chưa được chỉ định
                    </Tag>
                );
            },
        },
        {
            title: <span className="font-semibold text-gray-700">Trạng thái</span>,
            dataIndex: "status",
            key: "status",
            render: (status: Appointment["status"], record) => {
                // Manager: can change any non-final status
                if (role === UserRole.MANAGER && !isFinalStatus(status)) {
                    return (
                        <Select
                            value={status}
                            style={{ width: 160 }}
                            className="rounded-lg"
                            onChange={(val) => handleChangeStatus(record.id, val as AppointmentStatus)}
                            optionLabelProp="label"
                        >
                            {Object.values(AppointmentStatus).map((st) => (
                                <Select.Option key={st} value={st} label={statusViMap[st]}>
                                    <Tag 
                                        color={statusColorMap[st]} 
                                        className="rounded-full px-3 py-1 font-medium border-0"
                                        style={{ margin: 0 }}
                                    >
                                        {statusViMap[st]}
                                    </Tag>
                                </Select.Option>
                            ))}
                        </Select>
                    );
                }

                // Consultant: only allow change from ASSIGNED to PROCESSING / COMPLETED / CANCELLED
                if (role === UserRole.CONSULTANT && (status === AppointmentStatus.ASSIGNED || status === AppointmentStatus.PROCESSING)) {
                    const allowedNext = status === AppointmentStatus.ASSIGNED
                        ? [AppointmentStatus.PROCESSING, AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED]
                        : [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED];
                    return (
                        <Select
                            value={status}
                            style={{ width: 160 }}
                            className="rounded-lg"
                            onChange={(val) => handleChangeStatus(record.id, val as AppointmentStatus)}
                            optionLabelProp="label"
                        >
                            {/* Disabled current status */}
                            <Select.Option value={status} disabled label={statusViMap[status]}>
                                <Tag 
                                    color={statusColorMap[status]} 
                                    className="rounded-full px-3 py-1 font-medium border-0"
                                    style={{ margin: 0 }}
                                >
                                    {statusViMap[status]}
                                </Tag>
                            </Select.Option>
                            {allowedNext.map((st) => (
                                <Select.Option key={st} value={st} label={statusViMap[st]}>
                                    <Tag 
                                        color={statusColorMap[st]} 
                                        className="rounded-full px-3 py-1 font-medium border-0"
                                        style={{ margin: 0 }}
                                    >
                                        {statusViMap[st]}
                                    </Tag>
                                </Select.Option>
                            ))}
                        </Select>
                    );
                }

                // Default: display tag only
                return (
                    <Tag 
                        color={statusColorMap[status] || "default"}
                        className="rounded-full px-3 py-1 font-medium border-0"
                    >
                        {statusViMap[status] || status}
                    </Tag>
                );
            },
        },
        {
            title: <span className="font-semibold text-gray-700">Ghi chú</span>,
            dataIndex: "note",
            key: "note",
            render: (note: string) => (
                <Tooltip title={note} placement="topLeft">
                    {note ? (
                        <div className="bg-gray-50 px-3 py-2 rounded-lg border-l-4 border-blue-400 max-w-xs">
                            <Typography.Paragraph
                                ellipsis={{ rows: 2, tooltip: false }}
                                style={{ margin: 0, fontStyle: 'italic', color: '#555', fontSize: 13, fontWeight: 500 }}
                            >
                                {note}
                            </Typography.Paragraph>
                        </div>
                    ) : (
                        <span className="text-gray-400 italic text-sm">Không có ghi chú</span>
                    )}
                </Tooltip>
            ),
        },
        {
            title: <span className="font-semibold text-gray-700">Hành động</span>,
            dataIndex: "action",
            key: "action",
            render: (_, record) => {
                return (
                    <Space size="small">
                        <Tooltip title="Xem chi tiết">
                            <Button
                                type="text"
                                shape="circle"
                                icon={<EyeOutlined />}
                                onClick={() => handleRowClick(record)}
                                className="hover:bg-blue-50 hover:text-blue-600 border-0 shadow-sm transition-all duration-200"
                                size="large"
                            />
                        </Tooltip>
                        {role === UserRole.CUSTOMER && !isFinalStatus(record.status) && (
                            <Tooltip title="Huỷ lịch hẹn">
                                <Button
                                    danger
                                    type="text"
                                    shape="circle"
                                    icon={<CloseCircleOutlined />}
                                    onClick={() => handleCancel(record)}
                                    className="hover:bg-red-50 hover:text-red-600 border-0 shadow-sm transition-all duration-200"
                                    size="large"
                                />
                            </Tooltip>
                        )}
                    </Space>
                );
            },
        },
    ];

    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
                        <Select
                            value={statusFilter}
                            onChange={(val) => setStatusFilter(val as any)}
                            style={{ width: 180 }}
                            className="rounded-lg"
                        >
                            <Select.Option value="ALL">
                                <span className="font-medium">Tất cả trạng thái</span>
                            </Select.Option>
                            {Object.values(AppointmentStatus).map(st => (
                                <Select.Option key={st} value={st}>
                                    <Tag color={statusColorMap[st]} className="rounded-full px-2 py-1 font-medium border-0" style={{ margin: 0 }}>
                                        {statusViMap[st]}
                                    </Tag>
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Thời gian:</span>
                        <RangePicker
                            format="DD/MM/YYYY"
                            value={dateRange as any}
                            onChange={(vals) => setDateRange(vals as any)}
                            className="rounded-lg"
                            placeholder={['Từ ngày', 'Đến ngày']}
                        />
                    </div>
                    <div className="flex gap-2 ml-auto">
                        <Button 
                            type="primary" 
                            onClick={handleApplyFilter} 
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 rounded-lg px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                            icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                            </svg>}
                        >
                            Lọc
                        </Button>
                        <Button 
                            onClick={handleClearFilter} 
                            className="hover:text-gray-600 hover:bg-gray-50 border border-gray-300 rounded-lg px-6 transition-all duration-200"
                            icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>}
                        >
                            Xóa lọc
                        </Button>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={appointments}
                    rowKey="id"
                    loading={loading}
                    className="custom-table"
                    pagination={{
                        total,
                        current: currentPage,
                        pageSize,
                        showSizeChanger: true,
                        onChange: onPaginationChange,
                        showTotal: (total, range) => (
                            <span className="text-gray-600 font-medium">
                                Hiển thị {range[0]}-{range[1]} trên tổng số {total} lịch hẹn
                            </span>
                        ),
                        className: "px-6 py-4 border-t border-gray-100",
                    }}
                    rowClassName="hover:bg-gray-50 transition-colors duration-150"
                />
            </div>
        </>
    );
};

export default AppointmentDisplay;
