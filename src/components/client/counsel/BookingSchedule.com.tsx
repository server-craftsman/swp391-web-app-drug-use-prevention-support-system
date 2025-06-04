import React, { useState } from "react";
import dayjs from "dayjs";
import DropdownComponent from "../../common/dropdown.com";
import consultants from "../../../data/consultants.json";
import type { Consultant } from "../../../types/consultant/ConsultantModel";

// Danh sách thời gian cố định
const availableTimes = [
  "08:30 - 09:30",
  "09:30 - 10:30",
  "10:30 - 11:30",
  "13:30 - 14:30",
  "14:30 - 15:30",
  "15:30 - 16:30",
  "16:30 - 17:30",
  "18:00 - 19:00",
  "19:00 - 20:00",
];

const getNext5Days = () => {
  return Array.from({ length: 5 }, (_, i) => {
    const date = dayjs().add(i, "day");
    return {
      label: `${date.format("dddd - D/M")}`,
      key: date.format("YYYY-MM-DD"),
    };
  });
};

const typedConsultants = consultants as Consultant[];

export default function BookingForm() {
  const [selectedDate, setSelectedDate] = useState(getNext5Days()[0].key);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedConsultantId, setSelectedConsultantId] = useState<
    number | null
  >(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedConsultant = typedConsultants.find(
    (c) => c.id === selectedConsultantId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTime || !fullName || !email || !selectedConsultantId) {
      setError(
        "Vui lòng điền đầy đủ thông tin và chọn tư vấn viên, khung giờ."
      );
      return;
    }

    setError("");

    const formData = {
      fullName,
      email,
      message,
      selectedDate,
      selectedTime,
      consultantId: selectedConsultantId,
    };

    console.log("📝 Dữ liệu đặt lịch:", formData);
    alert("Đặt lịch thành công!");

    // Reset form
    setFullName("");
    setEmail("");
    setMessage("");
    setSelectedTime(null);
    setSelectedDate(getNext5Days()[0].key);
    setSelectedConsultantId(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-4 "
    >
      <h2 className="text-xl font-bold text-[#20558A] mb-2">Đặt lịch tư vấn</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Họ tên
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2"
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2"
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Chọn tư vấn viên
        </label>
        <select
          value={selectedConsultantId ?? ""}
          onChange={(e) => setSelectedConsultantId(Number(e.target.value))}
          className="mt-1 w-full border rounded px-3 py-2"
        >
          <option value="" disabled>
            -- Chọn tư vấn viên --
          </option>
          {typedConsultants.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fullName} ({c.jobTitle})
            </option>
          ))}
        </select>

        {selectedConsultant && (
          <div className="flex items-center gap-3 mt-3 p-3 bg-gray-50 rounded-lg border">
            <img
              src={selectedConsultant.avatar}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-cyan-700">
                {selectedConsultant.fullName}
              </p>
              <p className="text-xs text-gray-500">
                {selectedConsultant.jobTitle}
              </p>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Chọn ngày
        </label>
        <DropdownComponent
          items={getNext5Days()}
          value={selectedDate}
          onChange={setSelectedDate}
          placeholder="Chọn ngày"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Chọn khung giờ
        </label>
        <div className="grid grid-cols-3 gap-2">
          {availableTimes.map((time) => (
            <button
              type="button"
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`px-3 py-2 text-sm border rounded-lg transition ${
                selectedTime === time
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-100 hover:bg-cyan-100"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nội dung tư vấn (tuỳ chọn)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="mt-1 w-full border rounded px-3 py-2"
          placeholder="Nhập nội dung bạn cần tư vấn..."
        ></textarea>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        className="bg-[#20558A] hover:bg-cyan-700 text-white py-2 px-4 rounded-lg w-full"
      >
        Đặt lịch ngay
      </button>
    </form>
  );
}
