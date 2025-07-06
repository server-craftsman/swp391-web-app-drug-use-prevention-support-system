import React, { useEffect, useState } from "react";
import { message } from "antd";
import AppointmentDisplay from "../../../components/customer/appointment/Display.com";
import { AppointmentService } from "../../../services/appointment/appointment.service";
import type { Appointment } from "../../../types/appointment/Appointment.res.type";

const PAGE_SIZE_DEFAULT = 10;

const AppointmentPage: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
    const [total, setTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState<string | undefined>();
    const [fromDate, setFromDate] = useState<string | undefined>();
    const [toDate, setToDate] = useState<string | undefined>();

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await AppointmentService.searchAppointments({
                pageNumber,
                pageSize,
                status: statusFilter as any,
                fromDate,
                toDate,
            } as any); // Cast to any in case types mismatch
            if (res?.data) {
                const { data: list, totalCount } = res.data as any;
                setAppointments(list);
                setTotal(totalCount ?? list.length);
            }
        } catch (err) {
            message.error("Không thể tải danh sách lịch hẹn!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [pageNumber, pageSize, statusFilter, fromDate, toDate]);

    const handlePaginationChange = (page: number, size: number) => {
        setPageNumber(page);
        setPageSize(size);
    };

    const handleFilterChange = (status?: string, from?: string, to?: string) => {
        setStatusFilter(status);
        setFromDate(from);
        setToDate(to);
        setPageNumber(1);
    };

    return (
        <div className="p-6 bg-white rounded-md">
            <h2 className="text-2xl font-semibold mb-4">Lịch hẹn của bạn</h2>
            <AppointmentDisplay
                appointments={appointments}
                loading={loading}
                total={total}
                currentPage={pageNumber}
                pageSize={pageSize}
                onPaginationChange={handlePaginationChange}
                onFilterChange={handleFilterChange}
                onRefresh={fetchAppointments}
            />
        </div>
    );
};

export default AppointmentPage;
