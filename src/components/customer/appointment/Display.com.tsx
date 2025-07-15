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
            title: "Khách hàng",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Thời gian hẹn",
            dataIndex: "appointmentTime",
            key: "appointmentTime",
            render: (value: string) => dayjs(value).format("DD/MM/YYYY HH:mm"),
        },
        {
            title: "Tư vấn viên",
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
                                        <Avatar size="small" src={c.profilePicUrl} />
                                        <div>
                                            <div>{c.fullName ?? c.name}</div>
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
                    displayName
                ) : (
                    <Tag color="default">Chưa được chỉ định</Tag>
                );
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: Appointment["status"], record) => {
                // Manager: can change any non-final status
                if (role === UserRole.MANAGER && !isFinalStatus(status)) {
                    return (
                        <Select
                            value={status}
                            style={{ width: 160 }}
                            onChange={(val) => handleChangeStatus(record.id, val as AppointmentStatus)}
                            optionLabelProp="label"
                        >
                            {Object.values(AppointmentStatus).map((st) => (
                                <Select.Option key={st} value={st} label={statusViMap[st]}>
                                    <Tag color={statusColorMap[st]} style={{ margin: 0 }}>{statusViMap[st]}</Tag>
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
                            onChange={(val) => handleChangeStatus(record.id, val as AppointmentStatus)}
                            optionLabelProp="label"
                        >
                            {/* Disabled current status */}
                            <Select.Option value={status} disabled label={statusViMap[status]}>
                                <Tag color={statusColorMap[status]} style={{ margin: 0 }}>{statusViMap[status]}</Tag>
                            </Select.Option>
                            {allowedNext.map((st) => (
                                <Select.Option key={st} value={st} label={statusViMap[st]}>
                                    <Tag color={statusColorMap[st]} style={{ margin: 0 }}>{statusViMap[st]}</Tag>
                                </Select.Option>
                            ))}
                        </Select>
                    );
                }

                // Default: display tag only
                return (
                    <Tag color={statusColorMap[status] || "default"}>{statusViMap[status] || status}</Tag>
                );
            },
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
            render: (note: string) => (
                <Tooltip title={note} placement="topLeft">
                    <Typography.Paragraph
                        ellipsis={{ rows: 2, tooltip: false }}
                        style={{ margin: 0, fontStyle: 'italic', color: '#555', fontSize: 12, fontWeight: 500 }}
                    >
                        {note}
                    </Typography.Paragraph>
                </Tooltip>
            ),
        },
        {
            title: "Hành động",
            dataIndex: "action",
            key: "action",
            render: (_, record) => {
                return (
                    <Space>
                        <Tooltip title="Xem chi tiết">
                            <Button
                                type="text"
                                shape="circle"
                                icon={<EyeOutlined />}
                                onClick={() => handleRowClick(record)}
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
            <div className="flex flex-wrap gap-4 mb-4 items-center">
                <Select
                    value={statusFilter}
                    onChange={(val) => setStatusFilter(val as any)}
                    style={{ width: 180 }}
                >
                    <Select.Option value="ALL">Tất cả trạng thái</Select.Option>
                    {Object.values(AppointmentStatus).map(st => (
                        <Select.Option key={st} value={st}>{statusViMap[st]}</Select.Option>
                    ))}
                </Select>
                <RangePicker
                    format="DD/MM/YYYY"
                    // disabledDate={(current) => current && current < dayjs().startOf('day')}
                    value={dateRange as any}
                    onChange={(vals) => setDateRange(vals as any)}
                />
                <Button type="primary" onClick={handleApplyFilter} className="bg-primary">Lọc</Button>
                <Button onClick={handleClearFilter} className="hover:text-primary">Xóa lọc</Button>
            </div>
            <Table
                columns={columns}
                dataSource={appointments}
                rowKey="id"
                loading={loading}
                // onRow={(record) => ({
                //     onClick: () => handleRowClick(record),
                // })}
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

export default AppointmentDisplay;
