import CounselCard from "./CounselCard.com";
import counsultants from "../../../data/consultants.json";
import type { Consultant } from "../../../types/consultant/ConsultantModel";
import BookingSchedule from "./BookingSchedule.com";

const typedCounsultans = counsultants as Consultant[];

export default function CounselList() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-[#20558A]">
      {/* Danh sách tư vấn viên */}
      <div className="md:col-span-2 space-y-6">
        {typedCounsultans.map((counsel) => (
          <CounselCard counsel={counsel} key={counsel.id} />
        ))}
      </div>

      {/* Lịch đặt hẹn */}
      <div className="sticky top-20 h-fit bg-white shadow-md rounded-xl p-4">
        <BookingSchedule />
      </div>
    </div>
  );
}
