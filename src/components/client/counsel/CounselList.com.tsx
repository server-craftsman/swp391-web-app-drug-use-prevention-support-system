import { useEffect, useState } from "react";
import CounselCard from "./CounselCard.com";
import type { Consultant } from "../../../types/consultant/consultant.res.type";
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#20558A] mb-4">
          Đội ngũ tư vấn viên chuyên nghiệp
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Tìm hiểu về đội ngũ tư vấn viên giàu kinh nghiệm của chúng tôi,
          sẵn sàng hỗ trợ bạn trong mọi vấn đề.
        </p>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : consultants.length === 0 ? (
          <Empty description="Không có tư vấn viên nào" />
        ) : (
          consultants.map((counsel) => (
            <CounselCard
              counsel={counsel}
              key={counsel.id}
            />
          ))
        )}

        {!loading && consultants.length > 0 && (
          <div className="flex justify-center mt-8">
            <CustomPagination
              current={current}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
