import { useEffect, useState } from "react";
import CounselCard from "./CounselCard.com";
import type { Consultant } from "../../../types/consultant/consultant.res.type";
// import BookingSchedule from "./BookingSchedule.com";
import { Spin, Empty } from "antd";
import { ConsultantService } from "../../../services/consultant/consultant.service";
import CustomPagination from "../../common/Pagiation.com";

const PAGE_SIZE = 4;

export default function CounselList() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [total, setTotal] = useState(0);

  const fetchConsultants = async (page = 1, size = PAGE_SIZE) => {
    setLoading(true);
    try {
      const params = {
        PageNumber: page,
        PageSize: size,
      };
      const res = await ConsultantService.getAllConsultants(params);
      const data = res.data as any;
      setConsultants(Array.isArray(data?.data) ? data.data : []);
      setTotal(data?.totalCount || 0);
    } catch (err) {
      setConsultants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultants(current, pageSize);
    // eslint-disable-next-line
  }, [current, pageSize]);

  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-[#20558A]">
      {/* Danh sách tư vấn viên */}
      <div className="md:col-span-2 space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        ) : consultants.length === 0 ? (
          <Empty description="Không có tư vấn viên nào" />
        ) : (
          consultants.map((counsel) => (
            <CounselCard counsel={counsel} key={counsel.id} />
          ))
        )}
        <div className="flex justify-center mt-6">
          <CustomPagination
            current={current}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
          />
        </div>
      </div>

      {/* Lịch đặt hẹn */}
      <div className="sticky top-20 h-fit bg-white rounded-xl p-4">
        {/* <BookingSchedule /> */}
      </div>
    </div>
  );
}
