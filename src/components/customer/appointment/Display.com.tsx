import React from "react";
import { Button, Space, Table, Tag, Tooltip, Select, DatePicker, message, Avatar, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Appointment } from "../../../types/appointment/Appointment.res.type";
import { AppointmentStatus } from "../../../app/enums/appointmentStatus.enum";
import { ConsultantService } from "../../../services/consultant/consultant.service";
import { AppointmentService } from "../../../services/appointment/appointment.service";
import { UserRole } from "../../../app/enums";
// import { helpers } from "../../../utils";
import dayjs from "dayjs";
import { CloseCircleOutlined } from "@ant-design/icons";

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
                .catch(() => message.error("Không thể tải danh sách tư vấn viên"));
        }
    }, [role]);

    const handleChangeStatus = async (appointmentId: string, newStatus: AppointmentStatus) => {
        try {
            await AppointmentService.changeStatus({ appointmentId, newStatus });
            message.success("Cập nhật trạng thái thành công");
            onRefresh();
        } catch (err) {
            message.error("Cập nhật trạng thái thất bại");
        }
    };

    const handleAssignConsultant = async (appointmentId: string, consultantUserId: string) => {
        try {
            await AppointmentService.assignConsultant({ appointmentId, consultantUserId });
            message.success("Gán tư vấn viên thành công");
            onRefresh();
        } catch (err) {
            message.error("Gán tư vấn viên thất bại");
        }
    };

    const handleCancel = async (record: Appointment) => {
        try {
            await AppointmentService.cancelAppointment(record.id);
            message.success("Đã hủy lịch hẹn");
            onRefresh();
        } catch (err) {
            message.error("Hủy lịch hẹn thất bại");
        }
    };

    const { RangePicker } = DatePicker;
    const [statusFilter, setStatusFilter] = React.useState<'ALL' | AppointmentStatus>('ALL');
    const [dateRange, setDateRange] = React.useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

    const handleApplyFilter = () => {
        if (dateRange && dateRange[0].isAfter(dateRange[1])) {
            message.error('Ngày bắt đầu phải trước ngày kết thúc');
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
                                    handleAssignConsultant(record.id, selected.userId ?? selected.id);
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
                if ((role === UserRole.MANAGER || role === UserRole.CONSULTANT) && !isFinalStatus(status)) {
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
                if (role === UserRole.CUSTOMER && !isFinalStatus(record.status)) {
                    return (
                        <Tooltip title="Huỷ lịch hẹn">
                            <Button
                                danger
                                type="text"
                                shape="circle"
                                icon={<CloseCircleOutlined />}
                                onClick={() => handleCancel(record)}
                            />
                        </Tooltip>
                    );
                }
                return null;
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
